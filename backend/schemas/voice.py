from pydantic import BaseModel

class VoiceUploadResponse(BaseModel):
    file_path: str
    status: str

class VoiceTranscribeRequest(BaseModel):
    file_path: str

class VoiceTranscribeResponse(BaseModel):
    transcript: str
    status: str
