import os
import logging
from dotenv import load_dotenv
from supabase import create_client, Client

# Load .env relative to this file's folder (database -> backend -> .env)
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path=env_path)

url = os.getenv("SUPABASE_URL", "")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

logger = logging.getLogger("api")

supabase: Client = None
is_supabase_configured = False

# Validate that the credentials are not placeholders
if url and url != "https://your-project.supabase.co" and key and key != "your-service-role-key":
    try:
        supabase = create_client(url, key)
        is_supabase_configured = True
        logger.info("Supabase client initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {str(e)}")
else:
    logger.warning("Supabase environment variables are missing or set to placeholders. Repositories will fall back to Mock Store.")
