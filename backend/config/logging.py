import logging
import os
from backend.middleware.request_id import get_current_request_id

# Create logs directory if not exists
os.makedirs("logs", exist_ok=True)

class RequestIDFormatter(logging.Formatter):
    def format(self, record):
        req_id = get_current_request_id()
        # Prepend request ID if present, otherwise leave it empty
        record.request_id = f"[{req_id}] " if req_id else ""
        return super().format(record)

# Formatters
default_formatter = RequestIDFormatter(
    "[%(asctime)s] %(levelname)s %(request_id)s[%(name)s:%(lineno)s] - %(message)s"
)

def setup_logger(name: str, log_file: str, level=logging.INFO) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Avoid duplicate handlers
    if not logger.handlers:
        file_handler = logging.FileHandler(os.path.join("logs", log_file))
        file_handler.setFormatter(default_formatter)
        
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(default_formatter)
        
        logger.addHandler(file_handler)
        console_handler.setFormatter(default_formatter)
        logger.addHandler(console_handler)
        
    return logger

api_logger = setup_logger("api", "api.log")
orchestrator_logger = setup_logger("orchestrator", "agents.log")
errors_logger = setup_logger("errors", "errors.log", logging.ERROR)
audit_logger = setup_logger("audit", "audit.log")
