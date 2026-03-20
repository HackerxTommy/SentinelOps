FROM ubuntu:22.04

LABEL maintainer="SentinelOps" \
      description="Isolated scanning environment with security tools"

ENV DEBIAN_FRONTEND=noninteractive
ENV GOPATH=/root/go
ENV PATH=$PATH:/usr/local/go/bin:$GOPATH/bin:/root/.local/bin

# ── System packages ──
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl wget git unzip python3 python3-pip \
    nmap dnsutils whois net-tools jq \
    ca-certificates chromium-browser \
    && rm -rf /var/lib/apt/lists/*

# ── Go 1.22 (for ProjectDiscovery tools) ──
RUN curl -sL https://go.dev/dl/go1.22.4.linux-amd64.tar.gz | tar -C /usr/local -xz

# ── ProjectDiscovery tools ──
RUN go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest && \
    go install github.com/projectdiscovery/httpx/cmd/httpx@latest && \
    go install github.com/projectdiscovery/katana/cmd/katana@latest && \
    go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest && \
    go install github.com/ffuf/ffuf/v2@latest

# ── Update nuclei templates ──
RUN nuclei -update-templates 2>/dev/null || true

# ── Python tools ──
RUN pip3 install --no-cache-dir \
    dirsearch \
    sqlmap

# ── Wordlists ──
RUN mkdir -p /opt/wordlists && \
    # SecLists (top lists only — full is 1GB+)
    git clone --depth 1 https://github.com/danielmiessler/SecLists.git /opt/SecLists && \
    # dirb wordlists
    mkdir -p /opt/wordlists/dirb && \
    cp -r /opt/SecLists/Discovery/Web-Content/common.txt /opt/wordlists/dirb/ && \
    cp -r /opt/SecLists/Discovery/Web-Content/directory-list-2.3-medium.txt /opt/wordlists/dirb/ && \
    cp -r /opt/SecLists/Discovery/DNS/ /opt/wordlists/dns/

# ── Create scan workspace ──
RUN mkdir -p /workspace /output

# ── Entrypoint: Accept JSON scan config via stdin, write results to /output ──
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /workspace
ENTRYPOINT ["/entrypoint.sh"]
