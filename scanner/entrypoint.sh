#!/bin/bash
# SentinelOps Scanner Entrypoint
# Reads a JSON scan config from the first argument (file path) and runs the pipeline.
# Results are written to /output/ as JSON files.
set -euo pipefail

CONFIG_FILE="${1:-/workspace/scan_config.json}"

if [ ! -f "$CONFIG_FILE" ]; then
  echo '{"error": "No scan config provided"}' > /output/error.json
  exit 1
fi

TARGET=$(jq -r '.target // empty' "$CONFIG_FILE")
SCAN_TYPE=$(jq -r '.scanType // "black-box"' "$CONFIG_FILE")
SCAN_ID=$(jq -r '.scanId // "unknown"' "$CONFIG_FILE")
PHASES=$(jq -r '.phases // "all"' "$CONFIG_FILE")

if [ -z "$TARGET" ]; then
  echo '{"error": "No target specified"}' > /output/error.json
  exit 1
fi

DOMAIN=$(echo "$TARGET" | sed -E 's|https?://||;s|/.*||;s|:.*||')

echo "{\"status\":\"running\",\"phase\":\"init\",\"message\":\"Starting scan for $DOMAIN\"}" > /output/progress.json

# ═══════════════════════════════════════
# PHASE 1: Subdomain Enumeration
# ═══════════════════════════════════════
if [ "$PHASES" = "all" ] || echo "$PHASES" | jq -e '. | index("subdomain")' > /dev/null 2>&1; then
  echo "{\"status\":\"running\",\"phase\":\"subdomain\",\"progress\":5,\"message\":\"Running subfinder...\"}" > /output/progress.json
  
  subfinder -d "$DOMAIN" -silent -o /output/subdomains_raw.txt 2>/dev/null || true
  
  # Convert to JSON
  if [ -f /output/subdomains_raw.txt ] && [ -s /output/subdomains_raw.txt ]; then
    jq -R -s 'split("\n") | map(select(length > 0)) | map({domain: ., source: "subfinder"})' \
      /output/subdomains_raw.txt > /output/subdomains.json
  else
    echo "[]" > /output/subdomains.json
    echo "$DOMAIN" > /output/subdomains_raw.txt
  fi
  
  echo "{\"status\":\"running\",\"phase\":\"subdomain\",\"progress\":10,\"message\":\"Found $(wc -l < /output/subdomains_raw.txt) subdomains\"}" > /output/progress.json
fi

# ═══════════════════════════════════════
# PHASE 2: Live Host Discovery
# ═══════════════════════════════════════
if [ "$PHASES" = "all" ] || echo "$PHASES" | jq -e '. | index("httpx")' > /dev/null 2>&1; then
  echo "{\"status\":\"running\",\"phase\":\"httpx\",\"progress\":15,\"message\":\"Probing live hosts with httpx...\"}" > /output/progress.json
  
  INPUT_FILE="/output/subdomains_raw.txt"
  [ ! -f "$INPUT_FILE" ] && echo "$DOMAIN" > "$INPUT_FILE"
  
  httpx -l "$INPUT_FILE" -silent -json -title -tech-detect -status-code -follow-redirects \
    -o /output/httpx_raw.json 2>/dev/null || true
  
  if [ -f /output/httpx_raw.json ] && [ -s /output/httpx_raw.json ]; then
    jq -s '.' /output/httpx_raw.json > /output/live_hosts.json
  else
    echo "[]" > /output/live_hosts.json
  fi
  
  LIVE_COUNT=$(jq 'length' /output/live_hosts.json)
  echo "{\"status\":\"running\",\"phase\":\"httpx\",\"progress\":20,\"message\":\"$LIVE_COUNT live hosts found\"}" > /output/progress.json
fi

# ═══════════════════════════════════════
# PHASE 3: Port Scanning
# ═══════════════════════════════════════
if [ "$PHASES" = "all" ] || echo "$PHASES" | jq -e '. | index("nmap")' > /dev/null 2>&1; then
  echo "{\"status\":\"running\",\"phase\":\"nmap\",\"progress\":25,\"message\":\"Port scanning with nmap...\"}" > /output/progress.json
  
  nmap -sV -sC --top-ports 1000 -T4 --open -oX /output/nmap_raw.xml "$DOMAIN" 2>/dev/null || true
  
  # Convert nmap XML to JSON (simplified)
  if [ -f /output/nmap_raw.xml ]; then
    python3 -c "
import xml.etree.ElementTree as ET, json, sys
try:
    tree = ET.parse('/output/nmap_raw.xml')
    root = tree.getroot()
    ports = []
    for host in root.findall('.//host'):
        addr = host.find('.//address')
        ip = addr.get('addr','') if addr is not None else ''
        for port in host.findall('.//port'):
            svc = port.find('service')
            state = port.find('state')
            ports.append({
                'host': ip,
                'port': int(port.get('portid',0)),
                'protocol': port.get('protocol',''),
                'state': state.get('state','') if state is not None else '',
                'service': svc.get('name','') if svc is not None else '',
                'version': svc.get('version','') if svc is not None else '',
                'product': svc.get('product','') if svc is not None else ''
            })
    json.dump(ports, open('/output/ports.json','w'), indent=2)
except Exception as e:
    json.dump([], open('/output/ports.json','w'))
" 2>/dev/null || echo "[]" > /output/ports.json
  else
    echo "[]" > /output/ports.json
  fi
  
  PORT_COUNT=$(jq 'length' /output/ports.json)
  echo "{\"status\":\"running\",\"phase\":\"nmap\",\"progress\":35,\"message\":\"$PORT_COUNT open ports found\"}" > /output/progress.json
fi

# ═══════════════════════════════════════
# PHASE 4: Directory Bruteforcing
# ═══════════════════════════════════════
if [ "$PHASES" = "all" ] || echo "$PHASES" | jq -e '. | index("directory")' > /dev/null 2>&1; then
  echo "{\"status\":\"running\",\"phase\":\"directory\",\"progress\":40,\"message\":\"Directory bruteforcing with dirsearch...\"}" > /output/progress.json
  
  dirsearch -u "$TARGET" -w /opt/wordlists/dirb/common.txt \
    --format json -o /output/dirsearch_raw.json \
    -t 30 --timeout 10 -q 2>/dev/null || true
  
  if [ -f /output/dirsearch_raw.json ] && [ -s /output/dirsearch_raw.json ]; then
    jq '[.results[]? | {url: .url, status: .status, size: .content_length, redirect: .redirect}]' \
      /output/dirsearch_raw.json > /output/directories.json 2>/dev/null || echo "[]" > /output/directories.json
  else
    echo "[]" > /output/directories.json
  fi
  
  # Also run ffuf for additional coverage
  ffuf -u "${TARGET}/FUZZ" -w /opt/wordlists/dirb/common.txt \
    -mc 200,201,301,302,403 -t 30 -timeout 10 \
    -o /output/ffuf_raw.json -of json -s 2>/dev/null || true
  
  if [ -f /output/ffuf_raw.json ] && [ -s /output/ffuf_raw.json ]; then
    jq '[.results[]? | {url: .url, status: .status, length: .length, words: .words}]' \
      /output/ffuf_raw.json >> /output/directories.json 2>/dev/null || true
  fi
  
  DIR_COUNT=$(jq 'length' /output/directories.json 2>/dev/null || echo "0")
  echo "{\"status\":\"running\",\"phase\":\"directory\",\"progress\":50,\"message\":\"$DIR_COUNT directories/files discovered\"}" > /output/progress.json
fi

# ═══════════════════════════════════════
# PHASE 5: JS Endpoint & File Analysis
# ═══════════════════════════════════════
if [ "$PHASES" = "all" ] || echo "$PHASES" | jq -e '. | index("katana")' > /dev/null 2>&1; then
  echo "{\"status\":\"running\",\"phase\":\"katana\",\"progress\":55,\"message\":\"Crawling JS endpoints with katana...\"}" > /output/progress.json
  
  katana -u "$TARGET" -jc -d 3 -silent -json -o /output/katana_raw.json 2>/dev/null || true
  
  if [ -f /output/katana_raw.json ] && [ -s /output/katana_raw.json ]; then
    jq -s '[.[] | {url: .request.endpoint, method: .request.method, source: .request.source}]' \
      /output/katana_raw.json > /output/endpoints.json 2>/dev/null || echo "[]" > /output/endpoints.json
    
    # Extract JS files specifically
    jq -s '[.[] | select(.request.endpoint | test("\\.js($|\\?)")) | .request.endpoint] | unique' \
      /output/katana_raw.json > /output/js_files.json 2>/dev/null || echo "[]" > /output/js_files.json
  else
    echo "[]" > /output/endpoints.json
    echo "[]" > /output/js_files.json
  fi
  
  EP_COUNT=$(jq 'length' /output/endpoints.json 2>/dev/null || echo "0")
  echo "{\"status\":\"running\",\"phase\":\"katana\",\"progress\":60,\"message\":\"$EP_COUNT endpoints crawled\"}" > /output/progress.json
fi

# ═══════════════════════════════════════
# PHASE 6: SQL Injection Testing
# ═══════════════════════════════════════
if [ "$PHASES" = "all" ] || echo "$PHASES" | jq -e '. | index("sqlmap")' > /dev/null 2>&1; then
  echo "{\"status\":\"running\",\"phase\":\"sqlmap\",\"progress\":65,\"message\":\"Testing for SQL injection with sqlmap...\"}" > /output/progress.json
  
  # Test the target URL for SQLi (batch mode, no interaction)
  sqlmap -u "$TARGET" --batch --level=2 --risk=2 \
    --output-dir=/output/sqlmap \
    --forms --crawl=2 \
    --threads=4 --timeout=15 \
    2>/dev/null || true
  
  # Parse sqlmap results
  python3 -c "
import json, os, glob
results = []
for f in glob.glob('/output/sqlmap/**/log', recursive=True):
    try:
        with open(f) as fh:
            content = fh.read()
            if 'is vulnerable' in content or 'injectable' in content:
                results.append({
                    'vulnerable': True,
                    'details': content[:2000],
                    'file': f
                })
    except: pass
json.dump(results, open('/output/sqli_results.json','w'), indent=2)
" 2>/dev/null || echo "[]" > /output/sqli_results.json
  
  echo "{\"status\":\"running\",\"phase\":\"sqlmap\",\"progress\":75,\"message\":\"SQLi testing complete\"}" > /output/progress.json
fi

# ═══════════════════════════════════════
# PHASE 7: Nuclei Vulnerability Scanning
# ═══════════════════════════════════════
if [ "$PHASES" = "all" ] || echo "$PHASES" | jq -e '. | index("nuclei")' > /dev/null 2>&1; then
  echo "{\"status\":\"running\",\"phase\":\"nuclei\",\"progress\":80,\"message\":\"Vulnerability scanning with nuclei...\"}" > /output/progress.json
  
  nuclei -u "$TARGET" -json -severity critical,high,medium,low \
    -o /output/nuclei_raw.json -silent 2>/dev/null || true
  
  if [ -f /output/nuclei_raw.json ] && [ -s /output/nuclei_raw.json ]; then
    jq -s '[.[] | {
      templateId: .["template-id"],
      name: .info.name,
      severity: .info.severity,
      description: .info.description,
      matched: .matched,
      host: .host,
      tags: .info.tags,
      reference: .info.reference,
      cwe: (.info.classification.cwe // null),
      cvss: (.info.classification["cvss-score"] // null)
    }]' /output/nuclei_raw.json > /output/nuclei_results.json 2>/dev/null || echo "[]" > /output/nuclei_results.json
  else
    echo "[]" > /output/nuclei_results.json
  fi
  
  VULN_COUNT=$(jq 'length' /output/nuclei_results.json 2>/dev/null || echo "0")
  echo "{\"status\":\"running\",\"phase\":\"nuclei\",\"progress\":90,\"message\":\"$VULN_COUNT vulnerabilities found by nuclei\"}" > /output/progress.json
fi

# ═══════════════════════════════════════
# PHASE 8: Security Header & SSL Analysis
# ═══════════════════════════════════════
echo "{\"status\":\"running\",\"phase\":\"headers\",\"progress\":92,\"message\":\"Checking security headers...\"}" > /output/progress.json

python3 -c "
import json, subprocess
target = '$TARGET'
headers_to_check = [
    'Strict-Transport-Security', 'Content-Security-Policy', 'X-Content-Type-Options',
    'X-Frame-Options', 'X-XSS-Protection', 'Referrer-Policy',
    'Permissions-Policy', 'Cross-Origin-Opener-Policy'
]
results = {'missing_headers': [], 'present_headers': []}
try:
    out = subprocess.run(['curl', '-sI', '-L', '--max-time', '10', target],
                         capture_output=True, text=True, timeout=15)
    resp_headers = out.stdout.lower()
    for h in headers_to_check:
        if h.lower() in resp_headers:
            results['present_headers'].append(h)
        else:
            results['missing_headers'].append(h)
    results['raw'] = out.stdout[:3000]
except Exception as e:
    results['error'] = str(e)
json.dump(results, open('/output/headers.json','w'), indent=2)
" 2>/dev/null || echo '{"missing_headers":[],"present_headers":[]}' > /output/headers.json

# ═══════════════════════════════════════
# FINAL: Compile all results
# ═══════════════════════════════════════
echo "{\"status\":\"running\",\"phase\":\"compile\",\"progress\":95,\"message\":\"Compiling results...\"}" > /output/progress.json

python3 << 'PYEOF'
import json, os, glob
from datetime import datetime

def safe_load(path, default=[]):
    try:
        with open(path) as f:
            return json.load(f)
    except:
        return default

results = {
    "scanId": os.environ.get("SCAN_ID", ""),
    "target": os.environ.get("TARGET", ""),
    "completedAt": datetime.utcnow().isoformat(),
    "subdomains": safe_load("/output/subdomains.json"),
    "liveHosts": safe_load("/output/live_hosts.json"),
    "ports": safe_load("/output/ports.json"),
    "directories": safe_load("/output/directories.json"),
    "endpoints": safe_load("/output/endpoints.json"),
    "jsFiles": safe_load("/output/js_files.json"),
    "sqliResults": safe_load("/output/sqli_results.json"),
    "nucleiResults": safe_load("/output/nuclei_results.json"),
    "headers": safe_load("/output/headers.json", {}),
    "summary": {
        "subdomainCount": len(safe_load("/output/subdomains.json")),
        "liveHostCount": len(safe_load("/output/live_hosts.json")),
        "openPortCount": len(safe_load("/output/ports.json")),
        "directoryCount": len(safe_load("/output/directories.json")),
        "endpointCount": len(safe_load("/output/endpoints.json")),
        "jsFileCount": len(safe_load("/output/js_files.json")),
        "nucleiVulnCount": len(safe_load("/output/nuclei_results.json")),
    }
}

json.dump(results, open("/output/results.json", "w"), indent=2)
PYEOF

echo "{\"status\":\"completed\",\"phase\":\"done\",\"progress\":100,\"message\":\"Scan complete\"}" > /output/progress.json
echo "Scan completed successfully."
