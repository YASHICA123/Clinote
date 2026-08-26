import re
import uuid
import zlib
import io
import os
import zipfile
import xml.etree.ElementTree as ET
import subprocess
import httpx
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from PIL import Image
from backend.config.settings import settings

MONTHS = {
    'jan': 1, 'january': 1, 'feb': 2, 'february': 2, 'mar': 3, 'march': 3,
    'apr': 4, 'april': 4, 'may': 5, 'jun': 6, 'june': 6, 'jul': 7, 'july': 7,
    'aug': 8, 'august': 8, 'sep': 9, 'september': 9, 'oct': 10, 'october': 10,
    'nov': 11, 'november': 11, 'dec': 12, 'december': 12
}

class AdmissionReportService:
    @staticmethod
    def parse_date_to_iso(date_str: str) -> str:
        if not date_str:
            return ''
        s = date_str.strip().lower()
        
        # 1. '18 May 1974' or '25 August 2026'
        m = re.search(r'(\d{1,2})\s+([a-z]+)\s+(\d{4})', s)
        if m:
            day, mon_name, year = int(m.group(1)), m.group(2), int(m.group(3))
            if mon_name in MONTHS:
                return f"{year:04d}-{MONTHS[mon_name]:02d}-{day:02d}"
                
        # 2. 'May 18, 1974'
        m = re.search(r'([a-z]+)\s+(\d{1,2}),?\s+(\d{4})', s)
        if m:
            mon_name, day, year = m.group(1), int(m.group(2)), int(m.group(3))
            if mon_name in MONTHS:
                return f"{year:04d}-{MONTHS[mon_name]:02d}-{day:02d}"
                
        # 3. 'YYYY-MM-DD'
        m = re.search(r'(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})', s)
        if m:
            return f"{int(m.group(1)):04d}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"
            
        # 4. 'DD-MM-YYYY'
        m = re.search(r'(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})', s)
        if m:
            return f"{int(m.group(3)):04d}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
            
        return date_str.strip()

    @classmethod
    def extract_text_via_windows_native_ocr(cls, file_bytes: bytes, ext: str = ".png") -> str:
        """
        Uses Windows 10/11 built-in Windows.Media.Ocr engine via PowerShell.
        Runs 100% locally, instantly, with zero API limits.
        """
        temp_id = uuid.uuid4().hex[:8]
        tmp_path = os.path.abspath(f"temp_ocr_{temp_id}{ext}")
        with open(tmp_path, "wb") as f:
            f.write(file_bytes)

        ps_script = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), "utils", "win_ocr.ps1"))
        
        try:
            p = subprocess.run(
                ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ps_script, "-ImagePath", tmp_path],
                capture_output=True,
                text=True,
                timeout=15
            )
            out = p.stdout.strip()
            if out:
                print(f"Windows Native OCR extracted {len(out)} characters.")
                return out
        except Exception as e:
            print(f"Windows Native OCR failed: {e}")
        finally:
            if os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                except Exception:
                    pass

        return ""

    @classmethod
    def extract_text_via_ocr_space(cls, file_bytes: bytes, filename: str) -> Optional[str]:
        api_key = settings.OCR_SPACE_API_KEY.strip()
        if not api_key:
            return None

        try:
            url = "https://api.ocr.space/parse/image"
            is_pdf = filename.lower().endswith(".pdf")
            content_type = "application/pdf" if is_pdf else "image/png"

            files = {
                "file": (filename, file_bytes, content_type)
            }
            data = {
                "apikey": api_key,
                "language": "eng",
                "isTable": "true",
                "OCREngine": "2",
                "scale": "true",
                "detectOrientation": "true"
            }
            if is_pdf:
                data["filetype"] = "PDF"

            with httpx.Client(timeout=15.0) as client:
                resp = client.post(url, files=files, data=data)
                
            if resp.status_code == 200:
                result = resp.json()
                if not result.get("IsErroredOnProcessing"):
                    parsed_results = result.get("ParsedResults", [])
                    text_list = [pr.get("ParsedText", "") for pr in parsed_results if pr.get("ParsedText")]
                    combined = "\n".join(text_list).strip()
                    if combined:
                        print(f"OCR.space extracted {len(combined)} chars.")
                        return combined
        except Exception as e:
            print(f"OCR.space skipped/failed: {e}")

        return None

    @classmethod
    def extract_text_from_pdf(cls, file_bytes: bytes) -> str:
        extracted_chunks: List[str] = []
        
        # 1. Match content streams: stream\r?\n ... \r?\nendstream
        stream_matches = re.findall(rb'stream[\r\n]+(.*?)[\r\n]+endstream', file_bytes, re.DOTALL)
        
        for stream_data in stream_matches:
            decomp = None
            for wbits in [zlib.MAX_WBITS, -zlib.MAX_WBITS, 15 + 32]:
                try:
                    decomp = zlib.decompress(stream_data, wbits)
                    break
                except Exception:
                    pass
            
            if decomp is None and (b'BT' in stream_data or b'Tj' in stream_data):
                decomp = stream_data
            
            if decomp:
                text_part = decomp.decode('latin-1', errors='ignore')
                
                # TJ arrays: [ (string) 120 (string) ] TJ
                for tj_arr in re.findall(r'\[(.*?)\]\s*TJ', text_part, re.DOTALL):
                    items = []
                    for match in re.finditer(r'\((.*?)(?<!\\\\)\)|<([0-9a-fA-F\s]+)>', tj_arr):
                        if match.group(1) is not None:
                            cleaned = match.group(1).replace('\\(', '(').replace('\\)', ')').replace('\\n', '\n').replace('\\r', '').replace('\\t', '\t').replace('\\\\', '\\')
                            items.append(cleaned)
                        elif match.group(2) is not None:
                            h = re.sub(r'\s+', '', match.group(2))
                            if len(h) % 2 == 0:
                                try:
                                    items.append(bytes.fromhex(h).decode('latin-1', errors='ignore'))
                                except Exception:
                                    pass
                    if items:
                        extracted_chunks.append(' '.join(items))

                # Tj strings: (string) Tj or (string) '
                for tj_match in re.finditer(r'\((.*?)(?<!\\\\)\)\s*T[j\']', text_part):
                    cleaned = tj_match.group(1).replace('\\(', '(').replace('\\)', ')').replace('\\n', '\n').replace('\\r', '').replace('\\t', '\t').replace('\\\\', '\\')
                    extracted_chunks.append(cleaned)

        if extracted_chunks:
            full_text = "\n".join(extracted_chunks)
            if len(full_text.strip()) > 20:
                return full_text

        # 2. If vector text stream is empty, check if PDF contains scanned image objects
        for stream_data in stream_matches:
            try:
                img_decomp = zlib.decompress(stream_data)
                img_ocr = cls.extract_text_via_windows_native_ocr(img_decomp, ".png")
                if img_ocr:
                    return img_ocr
            except Exception:
                pass

        return ""

    @classmethod
    def extract_text_from_docx(cls, file_bytes: bytes) -> str:
        """
        Extracts structured text and table cell contents from Word .docx files.
        """
        try:
            with zipfile.ZipFile(io.BytesIO(file_bytes)) as zf:
                if 'word/document.xml' in zf.namelist():
                    xml_content = zf.read('word/document.xml')
                    tree = ET.fromstring(xml_content)
                    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                    
                    lines: List[str] = []
                    # 1. Process paragraphs
                    for p in tree.findall('.//w:p', ns):
                        t_nodes = p.findall('.//w:t', ns)
                        if t_nodes:
                            p_text = "".join([t.text for t in t_nodes if t.text])
                            if p_text.strip():
                                lines.append(p_text.strip())

                    # 2. Process table rows specifically
                    for tr in tree.findall('.//w:tr', ns):
                        row_cells = []
                        for tc in tr.findall('.//w:tc', ns):
                            cell_text = "".join([t.text for t in tc.findall('.//w:t', ns) if t.text])
                            if cell_text.strip():
                                row_cells.append(cell_text.strip())
                        if row_cells:
                            lines.append("  :  ".join(row_cells))

                    if lines:
                        return "\n".join(lines)
        except Exception as e:
            print(f"Error parsing .docx: {e}")

        # Fallback for plain .doc or text content
        return file_bytes.decode('latin-1', errors='ignore')

    @classmethod
    def extract_text_from_image(cls, file_bytes: bytes, filename: str) -> str:
        ext = os.path.splitext(filename)[1] or ".png"
        
        # 1. Try Windows Native Media OCR (instant local OCR engine)
        native_ocr = cls.extract_text_via_windows_native_ocr(file_bytes, ext)
        if native_ocr:
            return native_ocr

        # 2. Try OCR.space cloud API
        cloud_ocr = cls.extract_text_via_ocr_space(file_bytes, filename)
        if cloud_ocr:
            return cloud_ocr

        # 3. Fallback: Image EXIF metadata
        try:
            img = Image.open(io.BytesIO(file_bytes))
            info = img.info or {}
            return " ".join([str(v) for v in info.values() if isinstance(v, str)])
        except Exception:
            return ""

    @classmethod
    def parse_admission_text(cls, text: str) -> Dict[str, Any]:
        """
        Robust clinical regex parser matching table headers, OCR misspellings, and key-value formats.
        """
        now = datetime.now(timezone.utc)
        data: Dict[str, Any] = {
            "full_name": "",
            "uhid": "",
            "date_of_birth": "",
            "age": None,
            "gender": "male",
            "phone_number": "",
            "address": "",
            "admission_date": now.strftime("%Y-%m-%d"),
            "admission_time": now.strftime("%I:%M %p"),
            "department": "General Medicine",
            "ward": "General Ward",
            "consultant": "Dr. Deepak Bhasin",
            "hospital": "Clinote Hospital & Medical Centre"
        }

        if not text:
            return data

        normalized_text = text.replace('\r\n', '\n').replace('\r', '\n')
        
        extract_rules = [
            ('full_name', [
                r'(?:Full\s*Name|Patient\s*Name|Pt\.?\s*Name|Name\s*of\s*Patient)\s*[:\t|\-=]?\s*([^\n\r|]{2,50})',
                r'Name\s*[:\t|\-=]\s*([^\n\r|]{2,50})'
            ]),
            ('uhid', [
                r'(?:UHID\s*/\s*MRN|UHID\s*-\s*MRN|UHID|MRN|LIHID|IPD?\s*(?:No|Number)?|Patient\s*ID|Reg(?:istration)?\s*No)\s*[:\t|\-=]?\s*([A-Za-z0-9\-_/]{3,30})',
                r'\b(MRN-[0-9]{3,8})\b',
                r'\b(UHID-[0-9]{3,8})\b'
            ]),
            ('gender', [
                r'(?:Gender|Sex)\s*[:\t|\-=]?\s*(Male|Female|Other|M|F)\b',
                r'/\s*(Male|Female|Other|M|F)\b'
            ]),
            ('age', [
                r'(?:Age|Poe|Years\s*Old)\s*[:\t|\-=]?\s*(\d{1,3})',
                r'(\d{1,3})\s*(?:Y(?:rs|ears)?|y/o)\b'
            ]),
            ('date_of_birth', [
                r'(?:Date\s*of\s*Birth|DOB|Birth\s*Date)\s*[:\t|\-=]?\s*([^\n\r|]{4,30})'
            ]),
            ('phone_number', [
                r'(?:Phone(?:\s*Number)?|Mobile(?:\s*Number)?|Contact(?:\s*No)?|Tel)\s*[:\t|\-=]?\s*([+\d\s\-()]{7,25})'
            ]),
            ('address', [
                r'(?:Residential\s*Address|Res\.\s*Address|Address)\s*[:\t|\-=]?\s*([^\n\r|]{5,100})'
            ]),
            ('admission_date', [
                r'(?:Admission\s*Date|Date\s*of\s*Admission|DOA|Adm\.?\s*Date)\s*[:\t|\-=]?\s*([^\n\r|]{4,30})'
            ]),
            ('admission_time', [
                r'(?:Admission\s*Time|Time\s*of\s*Admission|Adm\.?\s*Time|Time)\s*[:\t|\-=]?\s*(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)'
            ]),
            ('department', [
                r'(?:Department|Specialty|Dept)\s*[:\t|\-=]?\s*([^\n\r|]{3,50})'
            ]),
            ('ward', [
                r'(?:Ward\s*/\s*Room\s*/\s*Bed|Ward\s*/\s*Room|Ward\s*/\s*Bed|Ward|Room(?:\s*No)?|Bed(?:\s*No)?)\s*[:\t|\-=]?\s*([^\n\r|]{2,40})'
            ]),
            ('consultant', [
                r'(?:Consultant\s*/\s*Attending\s*Doctor|Consultant|Attending\s*(?:Doctor|Physician)|Doctor|Treating\s*Doctor)\s*[:\t|\-=]?\s*([^\n\r|]{2,50})'
            ]),
            ('hospital', [
                r'(?:Hospital\s*/\s*Facility|Hospital|Facility|Medical\s*Centre|Clinic)\s*[:\t|\-=]?\s*([^\n\r|]{4,60})'
            ])
        ]

        for field, patterns in extract_rules:
            for pat in patterns:
                m = re.search(pat, normalized_text, re.IGNORECASE)
                if m:
                    raw_val = m.group(1).strip()
                    clean_val = re.sub(r'[\s/:\-_#|]+$', '', raw_val).strip()
                    
                    if field == 'age':
                        try:
                            age_num = int(re.search(r'\d+', clean_val).group(0))
                            if 0 <= age_num <= 125:
                                data['age'] = age_num
                        except Exception:
                            pass
                    elif field == 'gender':
                        g = clean_val.upper()
                        data['gender'] = 'female' if g in ['F', 'FEMALE'] else 'male' if g in ['M', 'MALE'] else 'other'
                    elif field in ['date_of_birth', 'admission_date']:
                        iso_date = cls.parse_date_to_iso(clean_val)
                        if iso_date:
                            data[field] = iso_date
                    elif field == 'full_name':
                        if not any(w in clean_val.lower() for w in ['embeddedfiles', 'names', 'content', 'crede', 'hospital', 'admission', 'report']):
                            data['full_name'] = clean_val.title()
                    else:
                        if clean_val and not any(w in clean_val.lower() for w in ['embeddedfiles', 'catalog', 'names']):
                            data[field] = clean_val
                    break

        return data

    @classmethod
    def process_admission_file(cls, filename: str, file_bytes: bytes) -> Dict[str, Any]:
        lower_name = filename.lower()
        extracted_text = ""
        engine_used = "local"

        if lower_name.endswith(".pdf"):
            extracted_text = cls.extract_text_from_pdf(file_bytes)
            engine_used = "pdf_stream"
            if not extracted_text and settings.OCR_SPACE_API_KEY.strip():
                cloud_text = cls.extract_text_via_ocr_space(file_bytes, filename)
                if cloud_text:
                    extracted_text = cloud_text
                    engine_used = "ocr.space"
        elif lower_name.endswith((".docx", ".doc")):
            extracted_text = cls.extract_text_from_docx(file_bytes)
            engine_used = "word_docx"
        elif lower_name.endswith((".png", ".jpg", ".jpeg", ".webp")):
            extracted_text = cls.extract_text_from_image(file_bytes, filename)
            engine_used = "native_ocr"
        else:
            extracted_text = file_bytes.decode("utf-8", errors="ignore")

        patient_data = cls.parse_admission_text(extracted_text)

        missing_fields: List[str] = []
        for field in ["full_name", "uhid", "age", "gender", "department", "consultant"]:
            if not patient_data.get(field):
                missing_fields.append(field)

        upload_id = f"UPL-{uuid.uuid4().hex[:8].upper()}"

        return {
            "upload_id": upload_id,
            "status": "processed",
            "filename": filename,
            "ocr_engine": engine_used,
            "raw_text_length": len(extracted_text),
            "patient_data": patient_data,
            "missing_fields": missing_fields
        }
