#!/usr/bin/env python3
"""
SentinelOps PR Scanner
Fetches a GitHub PR diff and scans added lines for vulnerabilities using regex.
Output: JSON to stdout only. Logs go to stderr.
"""
import sys
import os
import re
import json
import argparse
import urllib.request
import urllib.error

VULN_PATTERNS = [
    {
        "type": "SQL Injection",
        "severity": "critical",
        "patterns": [
            r'''(?:execute|query|raw)\s*\(\s*[f"'`].*?\{.*?\}''',
            r'''(?:execute|query)\s*\(\s*.*?\+\s*(?:req|request|params|body|query)''',
            r'''(?:SELECT|INSERT|UPDATE|DELETE)\s+.*?\+\s*(?:req|request|params|body|input)''',
        ],
        "description": "User input concatenated into SQL query",
        "patch_hint": "Use parameterized queries instead of string concatenation."
    },
    {
        "type": "Cross-Site Scripting (XSS)",
        "severity": "high",
        "patterns": [
            r'''innerHTML\s*=\s*(?:req|request|params|body|query|user)''',
            r'''res\.send\s*\(\s*(?:req\.(?:body|query|params))''',
            r'''dangerouslySetInnerHTML''',
        ],
        "description": "User-controlled input rendered without sanitization",
        "patch_hint": "Sanitize all user input before rendering."
    },
    {
        "type": "Hardcoded Secret",
        "severity": "critical",
        "patterns": [
            r'''(?:password|secret|api_key|apikey|token|auth_token|access_key)\s*=\s*["\'][^"\']{8,}["\']''',
            r'''-----BEGIN (?:RSA |EC )?PRIVATE KEY-----''',
            r'''(?:ghp_|gho_|github_pat_)[A-Za-z0-9_]{20,}''',
        ],
        "description": "Sensitive credential hardcoded in source code",
        "patch_hint": "Move secrets to environment variables."
    },
    {
        "type": "Command Injection",
        "severity": "critical",
        "patterns": [
            r'''(?:exec|spawn|execSync|system|popen)\s*\(.*?(?:req|request|params|body|input)''',
            r'''eval\s*\(\s*(?:req|request|params|body|query|input)''',
        ],
        "description": "User input passed to system command execution",
        "patch_hint": "Never pass user input to shell commands."
    },
    {
        "type": "Path Traversal",
        "severity": "high",
        "patterns": [
            r'''(?:readFile|readFileSync|open)\s*\(.*?(?:req|request|params|body|query)''',
        ],
        "description": "User input used in file path operations",
        "patch_hint": "Validate and sanitize file paths."
    },
]


def fetch_pr_diff(repo_url, pr_number, github_token=None):
    """Fetch raw diff from a GitHub PR."""
    # Parse owner/repo from URL
    parts = repo_url.rstrip('/').replace('.git', '').split('/')
    repo = parts[-1]
    owner = parts[-2]

    diff_url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pr_number}"
    headers = {
        'User-Agent': 'SentinelOps-PR-Scanner',
        'Accept': 'application/vnd.github.v3.diff',
    }
    if github_token:
        headers['Authorization'] = f'Bearer {github_token}'

    req = urllib.request.Request(diff_url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return response.read().decode('utf-8', errors='ignore')
    except urllib.error.HTTPError as e:
        print(f"[!] GitHub API error {e.code}: {e.reason}", file=sys.stderr)
        raise


def parse_diff(diff_text):
    """Parse unified diff and extract added lines with file info."""
    added_lines = []
    current_file = None
    current_line = 0

    for line in diff_text.split('\n'):
        if line.startswith('diff --git'):
            # Extract filename
            parts = line.split(' b/')
            if len(parts) > 1:
                current_file = parts[-1]
        elif line.startswith('@@'):
            # Parse line number from hunk header
            match = re.search(r'\+(\d+)', line)
            if match:
                current_line = int(match.group(1)) - 1
        elif line.startswith('+') and not line.startswith('+++'):
            current_line += 1
            if current_file:
                added_lines.append({
                    'file': current_file,
                    'line': current_line,
                    'content': line[1:]  # Remove the leading +
                })
        elif not line.startswith('-'):
            current_line += 1

    return added_lines


def scan_added_lines(added_lines):
    """Scan added lines for vulnerability patterns."""
    findings = []
    for item in added_lines:
        content = item['content']
        for vuln in VULN_PATTERNS:
            for pattern in vuln['patterns']:
                try:
                    if re.search(pattern, content, re.IGNORECASE):
                        findings.append({
                            "file": item['file'],
                            "line": item['line'],
                            "type": vuln["type"],
                            "severity": vuln["severity"],
                            "description": vuln["description"],
                            "code_snippet": content.strip()[:200],
                            "patched_code": f"// FIXME: {vuln['patch_hint']}\n// {content.strip()[:150]}",
                        })
                        break
                except re.error:
                    pass
    return findings


def main():
    parser = argparse.ArgumentParser(description='SentinelOps PR Scanner')
    parser.add_argument('--repo-url', required=True, help='GitHub repository URL')
    parser.add_argument('--pr-number', required=True, help='Pull request number')
    parser.add_argument('--github-token', default=None, help='GitHub personal access token')
    args = parser.parse_args()

    try:
        print(f"[*] Fetching PR #{args.pr_number} from {args.repo_url}...", file=sys.stderr)
        diff_text = fetch_pr_diff(args.repo_url, args.pr_number, args.github_token)

        added_lines = parse_diff(diff_text)
        print(f"[*] Parsed {len(added_lines)} added lines from diff.", file=sys.stderr)

        findings = scan_added_lines(added_lines)

        # Deduplicate
        seen = set()
        unique = []
        for f in findings:
            key = (f["file"], f["line"], f["type"])
            if key not in seen:
                seen.add(key)
                unique.append(f)

        print(f"[*] Found {len(unique)} potential vulnerabilities.", file=sys.stderr)

        result = {
            "success": True,
            "data": {
                "files_scanned": len(set(item['file'] for item in added_lines)),
                "vulnerabilities": unique,
            },
            "error": None,
        }
        print(json.dumps(result))

    except Exception as e:
        result = {"success": False, "data": {"files_scanned": 0, "vulnerabilities": []}, "error": str(e)}
        print(json.dumps(result))
        sys.exit(1)


if __name__ == '__main__':
    main()
