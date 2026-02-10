#!/usr/bin/env python3
"""
SentinelOps Native Reconnaissance Engine (Python Fallback)

Performs security reconnaissance natively WITHOUT Docker or external binaries.
Features:
1. Native Python HTTP/HTTPS probing for live hosts, headers
2. DNS lookups for subdomain enumeration
3. HTTP-based directory/endpoint discovery
4. Deep link and JS endpoint extraction

This script dumps a JSON result matching the expected format of the
Docker-based recon engine.
"""

import sys
import json
import socket
import ssl
import urllib.request
import urllib.error
import urllib.parse
from urllib.parse import urlparse, urljoin
import concurrent.futures
from datetime import datetime
import re
import os

# Configuration
TIMEOUT = 5
MAX_BODY = 100000
COMMON_DIRS = [
    '/', '/robots.txt', '/sitemap.xml', '/.env', '/.git/HEAD',
    '/wp-admin/', '/admin/', '/login', '/api/', '/api/v1/', '/swagger.json',
    '/server-status', '/health', '/debug/', '/config', '/phpinfo.php',
    '/backup/', '/.htaccess', '/package.json', '/composer.json',
]

SUBDOMAIN_PREFIXES = [
    'www', 'mail', 'ftp', 'api', 'dev', 'staging', 'test', 'admin', 'portal',
    'app', 'blog', 'shop', 'cdn', 'static', 'beta', 'v1', 'v2', 'dashboard'
]

PORTS = [21, 22, 25, 53, 80, 443, 445, 1433, 3306, 3389, 5432, 6379, 8080, 8443, 27017]

class NativeRecon:
    def __init__(self, target, output_dir):
        self.target = target
        self.output_dir = output_dir
        self.domain = urlparse(target if target.startswith('http') else f"https://{target}").hostname
        if not self.domain:
            self.domain = target.replace('https://', '').replace('http://', '').split('/')[0]
            
        self.base_url = target if target.startswith('http') else f"https://{self.domain}"
        self.results = {
            'target': self.target,
            'timestamp': datetime.utcnow().isoformat(),
            'subdomains': [],
            'ports': [],
            'urls': [], # used as liveHosts and endpoints in orchestrator mapping
            'directories': [],
            'vulnerabilities': [], # maps to nucleiResults
            'cves': [],
            'exploits': []
        }

    def fetch_url(self, url, check_body=False):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'SentinelOps Native Recon'})
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            
            with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as response:
                body = response.read(MAX_BODY).decode('utf-8', errors='ignore') if check_body else ""
                return {
                    'url': url,
                    'status': response.status,
                    'headers': dict(response.headers),
                    'body': body
                }
        except urllib.error.HTTPError as e:
            body = e.read(MAX_BODY).decode('utf-8', errors='ignore') if check_body else ""
            return {'url': url, 'status': e.code, 'headers': dict(e.headers), 'body': body}
        except Exception:
            return None

    def enum_subdomains(self):
        print("[*] Enumerating subdomains...")
        found = []
        def check_sub(prefix):
            sub = f"{prefix}.{self.domain}"
            try:
                socket.gethostbyname(sub)
                return sub
            except:
                return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = {executor.submit(check_sub, p): p for p in SUBDOMAIN_PREFIXES}
            for future in concurrent.futures.as_completed(futures):
                res = future.result()
                if res:
                    found.append(res)
                    self.results['subdomains'].append({'domain': res, 'source': 'dns'})
        
        try:
            socket.gethostbyname(self.domain)
            self.results['subdomains'].append({'domain': self.domain, 'source': 'main'})
        except:
            pass

    def check_live_hosts(self):
        print("[*] Checking live hosts...")
        hosts_to_check = [s['domain'] for s in self.results['subdomains']]
        if not hosts_to_check:
            hosts_to_check = [self.domain]
            
        def check_host(h):
            for proto in ['https', 'http']:
                url = f"{proto}://{h}"
                res = self.fetch_url(url, check_body=True)
                if res and res['status'] > 0:
                    title_match = re.search(r'<title>(.*?)</title>', res['body'], re.IGNORECASE)
                    title = title_match.group(1).strip() if title_match else ""
                    return {
                        'url': url,
                        'status_code': res['status'],
                        'title': title
                    }
            return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            for future in concurrent.futures.as_completed([executor.submit(check_host, h) for h in hosts_to_check]):
                res = future.result()
                if res:
                    self.results['urls'].append(res)

    def scan_ports(self):
        print("[*] Scanning common ports...")
        def check_port(port):
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex((self.domain, port))
            sock.close()
            if result == 0:
                return {'host': self.domain, 'port': port, 'state': 'open'}
            return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            for future in concurrent.futures.as_completed([executor.submit(check_port, p) for p in PORTS]):
                res = future.result()
                if res:
                    self.results['ports'].append(res)

    def bruteforce_dirs(self):
        print("[*] Bruteforcing directories...")
        def check_dir(path):
            url = f"{self.base_url.rstrip('/')}{path}"
            res = self.fetch_url(url)
            if res and res['status'] < 400:
                return {'url': url, 'status': res['status']}
            return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            for future in concurrent.futures.as_completed([executor.submit(check_dir, d) for d in COMMON_DIRS]):
                res = future.result()
                if res:
                    self.results['directories'].append(res)

    def extract_endpoints(self):
        print("[*] Extracting endpoints...")
        main_res = self.fetch_url(self.base_url, check_body=True)
        if not main_res or not main_res['body']:
            return

        body = main_res['body']
        
        # JS Files
        js_files = []
        for match in re.finditer(r'(?:src|href)\s*=\s*["\']([^"\']*\.js)', body):
            js_url = match.group(1)
            if js_url.startswith('/'): js_url = f"{self.base_url.rstrip('/')}{js_url}"
            js_files.append(js_url)

        for js_url in list(set(js_files))[:5]:
            self.results['urls'].append({'url': js_url, 'method': 'GET', 'source': 'html'})
            
        # Basic link extraction
        for match in re.finditer(r'href\s*=\s*["\'](/[^\'" >]+)', body):
            self.results['urls'].append({
                'url': f"{self.base_url.rstrip('/')}{match.group(1)}",
                'method': 'GET',
                'source': 'html'
            })

    def run(self):
        self.enum_subdomains()
        self.check_live_hosts()
        self.scan_ports()
        self.bruteforce_dirs()
        self.extract_endpoints()
        
        # Deduplicate URLs
        seen = set()
        unique_urls = []
        for u in self.results['urls']:
            if u['url'] not in seen:
                seen.add(u['url'])
                unique_urls.append(u)
        self.results['urls'] = unique_urls

        # Save to output directory
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
            
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        filename = f"recon_{self.domain.replace('.', '_')}_{timestamp}.json"
        out_path = os.path.join(self.output_dir, filename)
        
        with open(out_path, 'w') as f:
            json.dump(self.results, f, indent=2)
            
        print(f"[*] Recon complete. Results saved to {out_path}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("target", help="Target domain/URL")
    parser.add_argument("-o", "--output", required=True, help="Output directory")
    args = parser.parse_args()
    
    recon = NativeRecon(args.target, args.output)
    recon.run()
