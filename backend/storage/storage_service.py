import os
import logging
from backend.database.supabase import supabase
class StorageService:
    @staticmethod
    def save_file(bucket_name: str, file_name: str, file_content: bytes) -> str:
        # Clean filename to avoid path issues
        safe_name = os.path.basename(file_name)
        
        # Upload to Supabase Storage bucket
        supabase.storage.from_(bucket_name).upload(
            path=safe_name,
            file=file_content,
            file_options={"cache-control": "3600", "upsert": "true"}
        )
        
        # Retrieve and return public URL
        public_url = supabase.storage.from_(bucket_name).get_public_url(safe_name)
        return public_url
        
    @staticmethod
    def get_file_url(bucket_name: str, file_name: str) -> str:
        return supabase.storage.from_(bucket_name).get_public_url(file_name)
