from typing import Dict, Any

class MedicationValidator:
    @staticmethod
    def validate_and_clean(data: Dict[str, Any]) -> Dict[str, Any]:
        cleaned = data.copy()
        
        # Standardize capitalization of Route
        if cleaned.get("route"):
            route = cleaned["route"].strip()
            if route.lower() == "iv":
                cleaned["route"] = "Intravenous"
            elif route.lower() == "po":
                cleaned["route"] = "Oral"
            else:
                cleaned["route"] = route.capitalize()
                
        # Set default status if missing
        if not cleaned.get("status"):
            cleaned["status"] = "Active"
            
        return cleaned
