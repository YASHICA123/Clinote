from typing import Dict, Any, Union

class PatientValidator:
    @staticmethod
    def validate_and_clean(data: Dict[str, Any]) -> Dict[str, Any]:
        cleaned = data.copy()
        
        # Validate age: ensure it is integer
        age = cleaned.get("age")
        if age is not None:
            if isinstance(age, str):
                # Handle text like "Sixty-Eight" or just convert numeric strings
                try:
                    cleaned["age"] = int(age)
                except ValueError:
                    # Fallback mapping or default
                    cleaned["age"] = 60  
            elif not isinstance(age, int):
                cleaned["age"] = int(age)
                
        # Validate bedNumber
        if not cleaned.get("bedNumber"):
            cleaned["bedNumber"] = "TBD"
            
        # Ensure status is uppercase
        if cleaned.get("status"):
            cleaned["status"] = cleaned["status"].upper()
            
        return cleaned
