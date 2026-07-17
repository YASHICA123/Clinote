FROM python:3.13-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend files into a subdirectory named 'backend'
COPY . ./backend/

# Set PYTHONPATH to allow 'backend.*' imports
ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["python", "backend/main.py"]
