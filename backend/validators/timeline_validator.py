from typing import Dict, Any
from datetime import datetime

class TimelineValidator:
    @staticmethod
    def validate_and_clean(data: Dict[str, Any]) -> Dict[str, Any]:
        cleaned = data.copy()
        
        # Ensure timestamp is set
        if not cleaned.get("timestamp"):
            cleaned["timestamp"] = datetime.now().strftime("%d %b %Y, %I:%M %p")
            
        # Capitalize type
        if cleaned.get("type"):
            cleaned["type"] = cleaned["type"].lower()
            
        return cleaned
