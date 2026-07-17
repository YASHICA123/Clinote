from typing import Any, Dict

def standard_response(success: bool, message: str, data: Any = None) -> Dict[str, Any]:
    return {
        "success": success,
        "message": message,
        "data": data if data is not None else {}
    }
