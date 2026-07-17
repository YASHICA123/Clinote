from fastapi import APIRouter, UploadFile, File, HTTPException, status
from backend.schemas.voice import VoiceUploadResponse, VoiceTranscribeRequest, VoiceTranscribeResponse
from backend.services.voice_service import VoiceService

router = APIRouter(prefix="/voice", tags=["Voice dictation"])

@router.post("/upload", response_model=VoiceUploadResponse)
async def upload_voice(file: UploadFile = File(...)):
    content = await file.read()
    res = VoiceService.upload_recording(file.filename, content)
    return res

@router.post("/transcribe", response_model=VoiceTranscribeResponse)
def transcribe_voice(payload: VoiceTranscribeRequest):
    transcription_result = VoiceService.transcribe_audio(payload.file_path)
    return {
        "transcript": transcription_result.get("transcript", ""),
        "status": "Success"
    }
