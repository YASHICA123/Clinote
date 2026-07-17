import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Clinote Backend"
    API_PORT: int = 8000
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Supabase (for future integration)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        extra = "ignore"

settings = Settings()
