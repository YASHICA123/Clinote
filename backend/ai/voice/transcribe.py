import os

class VoiceTranscriber:
    @staticmethod
    def transcribe(audio_path: str) -> str:
        # Simulate audio transcription
        return (
            "Patient Roshan Lal, 68 year old male in bed 11. Complaining of mild chest tightness, "
            "but vitals are stable. Heart rate is 88, blood pressure is 132 over 84. "
            "We will continue current nebulizations Q6H and monitor oxygen levels closely."
        )
