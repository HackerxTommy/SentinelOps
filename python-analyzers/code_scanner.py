#!/usr/bin/env python3
"""
SentinelOps Whitebox Code Scanner
Scans a local folder for common vulnerabilities using regex patterns.
Output: JSON to stdout only. Logs go to stderr.
"""
import sys
import os
import re
import json
import argparse

VULN_PATTERNS = [
    {
        "type": "SQL Injection",
        "severity": "critical",
        "patterns": [
            r'(?:execute|query|raw)\s*\(\s*[f"\'`].*?\{.*?\}',
            r'(?:execute|query|raw)\s*\(\s*["\'].*?\%s',
            r'(?:execute|query)\s*\(\s*.*?\+\s*(?:req|request|params|body|query)\.',
            r'(?:SELECT|INSERT|UPDATE|DELETE)\s+.*?\+\s*(?:req|request|params|body|input|user)\.',
            r'db\.(?:execute|query)\s*\(\s*[`"\'].*?\$\{',
        ],
        "description": "User input concatenated into SQL query without parameterization",
        "patch_hint": "Use parameterized queries or prepared statements instead of string concatenation."
    },
    {
        "type": "Cross-Site Scripting (XSS)",
        "severity": "high",
        "patterns": [
            r'innerHTML\s*=\s*(?:req|request|params|body|query|user)\.',
            r'document\.write\s*\(.*?(?:req\.|request\.|location\.|search|hash)',
            r'\.html\s*\(\s*(?:req\.|request\.|params\.|body\.|query\.|data\.)',
            r'res\.send\s*\(\s*req\.(?:body|query|params)',
            r'dangerouslySetInnerHTML\s*=\s*\{\s*\{.*?(?:props|state|data)\.',
        ],
        "description": "User-controlled input rendered without sanitization",
        "patch_hint": "Sanitize all user input before rendering. Use textContent instead of innerHTML."
    },
    {
        "type": "Hardcoded Secret",
        "severity": "critical",
        "patterns": [
            r'(?:password|passwd|pwd|secret|api_key|apikey|api_secret|auth_token|access_key)\s*=\s*["\'][A-Za-z0-9+/=@#$%^&*!]{8,}["\']',
            r'(?:AWS_SECRET|AWS_ACCESS|PRIVATE_KEY)\s*=\s*["\'][^"\']+["\']',
            r'-----BEGIN (?:RSA |EC )?PRIVATE KEY-----',
            r'(?:ghp_|gho_|github_pat_)[A-Za-z0-9_]{20,}',
            r'sk-[A-Za-z0-9]{20,}',
        ],
        "description": "Sensitive credential or API key hardcoded in source code",
        "patch_hint": "Move secrets to environment variables or a secrets manager."
    },
    {
        "type": "Command Injection",
        "severity": "critical",
        "patterns": [
            r'(?:exec|spawn|execSync|execFile|system|popen|subprocess\.(?:call|run|Popen))\s*\(.*?(?:req\.|request\.|params\.|body\.|query\.|input\.|user\.)',
            r'(?:child_process|os\.system|os\.popen)\s*.*?\+\s*(?:req\.|request\.|input\.|user\.)',
            r'eval\s*\(\s*(?:req\.|request\.|params\.|body\.|query\.|input\.)',
        ],
        "description": "User input passed to system command execution without sanitization",
        "patch_hint": "Never pass user input directly to shell commands. Use allowlists or parameterized execution."
    },
    {
        "type": "Path Traversal",
        "severity": "high",
        "patterns": [
            r'(?:readFile|readFileSync|createReadStream|fs\.open)\s*\(.*?(?:req\.|request\.|params\.|body\.|query\.)',
            r'path\.(?:join|resolve)\s*\(.*?(?:req\.|request\.|params\.|body\.|query\.)',
            r'\.\./\.\./\.\.',
        ],
        "description": "User input used in file path operations without validation",
        "patch_hint": "Validate and sanitize file paths. Use path.resolve and check against a base directory."
    },
    {
        "type": "Insecure Deserialization",
        "severity": "high",
        "patterns": [
            r'pickle\.loads\s*\(',
            r'yaml\.load\s*\([^)]*$',
            r'JSON\.parse\s*\(\s*req\.(?:body|query|params)',
            r'unserialize\s*\(\s*\$_(?:GET|POST|REQUEST|COOKIE)',
        ],
        "description": "Untrusted data deserialized without validation",
        "patch_hint": "Validate and sanitize input before deserialization. Use safe loaders."
    },
]

SKIP_DIRS = {'node_modules', '.git', 'vendor', '__pycache__', '.venv', 'venv', 'dist', 'build', '.next', '.planning'}
CODE_EXTS = {'.js', '.jsx', '.ts', '.tsx', '.py', '.php', '.rb', '.java', '.go', '.cs', '.c', '.cpp', '.rs'}


def scan_file(filepath, base_path):
    """Scan a single file for vulnerability patterns."""
    findings = []
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
    except Exception:
        return findings

    rel_path = os.path.relpath(filepath, base_path)

    for line_num, line in enumerate(lines, 1):
        # Skip comment-only lines
        stripped = line.strip()
        if stripped.startswith('//') or stripped.startswith('#') or stripped.startswith('*'):
            continue

        for vuln in VULN_PATTERNS:
            for pattern in vuln["patterns"]:
                try:
                    if re.search(pattern, line, re.IGNORECASE):
                        snippet = line.strip()[:200]
                        findings.append({
                            "file": rel_path.replace('\\', '/'),
                            "line": line_num,
                            "type": vuln["type"],
                            "severity": vuln["severity"],
                            "description": vuln["description"],
                            "code_snippet": snippet,
                            "patched_code": f"// FIXME: {vuln['patch_hint']}\n// {snippet}",
                        })
                        break  # one match per vuln type per line
                except re.error:
                    pass
    return findings


def scan_directory(dir_path):
    """Walk directory and scan all code files."""
    all_findings = []
    files_scanned = 0

    for root, dirs, files in os.walk(dir_path):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for fname in files:
            ext = os.path.splitext(fname)[1].lower()
            if ext not in CODE_EXTS:
                continue
            fpath = os.path.join(root, fname)
            files_scanned += 1
            findings = scan_file(fpath, dir_path)
            all_findings.extend(findings)
            if files_scanned % 50 == 0:
                print(f"[*] Scanned {files_scanned} files...", file=sys.stderr)

    return files_scanned, all_findings


def main():
    parser = argparse.ArgumentParser(description='SentinelOps Code Scanner')
    parser.add_argument('--path', required=True, help='Path to source code directory')
    args = parser.parse_args()

    if not os.path.isdir(args.path):
        result = {"success": False, "data": {"files_scanned": 0, "vulnerabilities": []}, "error": f"Path not found: {args.path}"}
        print(json.dumps(result))
        sys.exit(1)

    print(f"[*] Scanning {args.path}...", file=sys.stderr)
    files_scanned, vulnerabilities = scan_directory(args.path)
    print(f"[*] Done. {files_scanned} files, {len(vulnerabilities)} findings.", file=sys.stderr)

    # Deduplicate (same file+line+type)
    seen = set()
    unique = []
    for v in vulnerabilities:
        key = (v["file"], v["line"], v["type"])
        if key not in seen:
            seen.add(key)
            unique.append(v)

    result = {
        "success": True,
        "data": {
            "files_scanned": files_scanned,
            "vulnerabilities": unique
        },
        "error": None
    }
    print(json.dumps(result))


if __name__ == '__main__':
    main()
