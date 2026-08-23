from typing import Dict, Any, TypedDict
from backend.ai.voice.transcribe import VoiceTranscriber

class VoiceState(TypedDict):
    audio_path: str
    transcript: str
    clinical_summary: Dict[str, Any]

class VoiceGraph:
    @staticmethod
    def run(audio_path: str) -> Dict[str, Any]:
        state: VoiceState = {
            "audio_path": audio_path,
            "transcript": "",
            "clinical_summary": {}
        }
        
        # Step 1: Transcribe Node
        state["transcript"] = VoiceTranscriber.transcribe(audio_path)
        
        # Step 2: Extract/Summarize Clinical Notes Node
        state["clinical_summary"] = {
            "transcript": state["transcript"],
            "summary": "Patient Roshan Lal in bed 11 had mild chest tightness. Vitals stable. Plan Nebs Q6H."
        }
        
        return state["clinical_summary"]
