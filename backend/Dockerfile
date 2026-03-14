FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install dependencies first for better caching
COPY requirements.txt .
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt && pip install --upgrade certifi

# Copy the rest of the application
COPY . .

# Create a non-root user and switch to it
RUN addgroup --system appgroup && adduser --system --group appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

