import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Load .env from project directory
env_path_root = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
env_path_backend = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(env_path_root)
load_dotenv(env_path_backend)
load_dotenv()

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env", os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")),
        extra="ignore"
    )

    PROJECT_NAME: str = "Clinote Clinical Platform"
    API_PORT: int = 8000
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000", "*"]
    
    # Database
    DATABASE_URL: str = "sqlite:///./clinote.db"
    
    # JWT & Auth
    JWT_SECRET: str = "clinote-phase1-super-secret-key-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # OCR.space API Integration
    OCR_SPACE_API_KEY: str = ""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.OCR_SPACE_API_KEY:
            self.OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY", "")

settings = Settings()
