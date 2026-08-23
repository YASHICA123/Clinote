from typing import Dict, Any
from backend.graphs.voice_graph import VoiceGraph

class VoiceService:
    @staticmethod
    def upload_recording(file_name: str, file_content: bytes) -> Dict[str, str]:
        return {"file_path": f"uploads/voice/{file_name}", "status": "Uploaded"}

    @staticmethod
    def transcribe_audio(audio_path: str) -> Dict[str, Any]:
        return VoiceGraph.run(audio_path)
