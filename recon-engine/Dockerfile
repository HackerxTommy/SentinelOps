FROM python:3.11.8-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nmap \
    curl \
    wget \
    git \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# Install Go for Go-based tools
RUN wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz && \
    rm go1.21.5.linux-amd64.tar.gz

ENV PATH="/usr/local/go/bin:${PATH}"

# Install Go-based security tools
RUN go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest && \
    go install -v github.com/projectdiscovery/dnsx/cmd/dnsx@latest && \
    go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest && \
    go install -v github.com/projectdiscovery/katana/cmd/katana@latest && \
    go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest && \
    go install -v github.com/ffuf/ffuf/v2@latest && \
    go install -v github.com/projectdiscovery/naabu/v2/cmd/naabu@latest

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install additional Python tools
RUN pip install --no-cache-dir \
    wafw00f \
    knockpy \
    assetfinder \
    python-nmap

# Install nuclei templates
RUN nuclei -update-templates

# Copy Python scripts and application files
COPY api_server.py /app/api_server.py
COPY scripts/ /app/scripts/
COPY utils/ /app/utils/
COPY tools/ /app/tools/

# Create output directory
RUN mkdir -p /app/output

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Expose port for API server
EXPOSE 8080

# Default command - run Flask API server with gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8080", "api_server:app"]
