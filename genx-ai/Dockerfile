FROM python:3.11-slim

WORKDIR /app

# Update keys and repositories
RUN apt-get update --allow-releaseinfo-change && \
    apt-get install -y --no-install-recommends gnupg debian-archive-keyring && \
    apt-get update && \
    apt-get install -y git libgl1-mesa-glx libglib2.0-0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Prepare static/temp directory
RUN mkdir -p /app/static/temp && chmod -R 777 /app/static/temp

COPY . .

EXPOSE 8000

CMD ["uvicorn", "api.app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
