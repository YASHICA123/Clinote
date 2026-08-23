import uuid
from contextvars import ContextVar
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

# ContextVars to store request tracking attributes
request_id_ctx_var: ContextVar[str] = ContextVar("request_id", default="")
user_email_ctx_var: ContextVar[str] = ContextVar("user_email", default="")
ip_address_ctx_var: ContextVar[str] = ContextVar("ip_address", default="")

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Extract Request ID from headers if client provided it, else generate one
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        ip_address = request.client.host if request.client else ""
        
        # Set the contextvars
        token_req = request_id_ctx_var.set(request_id)
        token_ip = ip_address_ctx_var.set(ip_address)
        
        # Attach to request state for easy access in endpoints
        request.state.request_id = request_id
        request.state.ip_address = ip_address
        
        try:
            response = await call_next(request)
        finally:
            # Reset contextvars
            request_id_ctx_var.reset(token_req)
            ip_address_ctx_var.reset(token_ip)
            
        # Return request ID in response headers
        response.headers["X-Request-ID"] = request_id
        return response

def get_current_request_id() -> str:
    return request_id_ctx_var.get()

def get_current_user_email() -> str:
    return user_email_ctx_var.get()

def set_current_user_email(email: str):
    user_email_ctx_var.set(email)

def get_current_ip_address() -> str:
    return ip_address_ctx_var.get()
