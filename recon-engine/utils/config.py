"""Configuration management for Recon Engine"""
import os
import json
from pathlib import Path


class Config:
    """Configuration class for reconnaissance engine"""
    
    def __init__(self, config_path: str = None):
        self.config = {
            'tools': {
                'subfinder': {
                    'enabled': True,
                    'timeout': 300
                },
                'dnsx': {
                    'enabled': True,
                    'timeout': 300
                },
                'nmap': {
                    'enabled': True,
                    'timeout': 600,
                    'ports': '1-65535',
                    'scan_type': '-sS -sV'
                },
                'httpx': {
                    'enabled': True,
                    'timeout': 60
                },
                'katana': {
                    'enabled': True,
                    'timeout': 300,
                    'depth': 3
                },
                'nuclei': {
                    'enabled': True,
                    'timeout': 600,
                    'severity': 'critical,high,medium'
                },
                'ffuf': {
                    'enabled': True,
                    'timeout': 300,
                    'wordlist': '/usr/share/wordlists/dirb/common.txt'
                },
                'gobuster': {
                    'enabled': True,
                    'timeout': 300,
                    'wordlist': '/usr/share/wordlists/dirb/common.txt'
                },
                'nikto': {
                    'enabled': True,
                    'timeout': 300
                }
            },
            'output': {
                'directory': '/app/output',
                'format': 'json'
            },
            'api_keys': {
                'shodan': os.getenv('SHODAN_API_KEY', ''),
                'virustotal': os.getenv('VIRUSTOTAL_API_KEY', '')
            },
            'rate_limit': {
                'requests_per_minute': 60
            }
        }
        
        if config_path:
            self.load_from_file(config_path)
    
    def load_from_file(self, config_path: str):
        """Load configuration from JSON file"""
        with open(config_path, 'r') as f:
            user_config = json.load(f)
            self._merge_config(self.config, user_config)
    
    def _merge_config(self, base: dict, override: dict):
        """Recursively merge configuration"""
        for key, value in override.items():
            if key in base and isinstance(base[key], dict) and isinstance(value, dict):
                self._merge_config(base[key], value)
            else:
                base[key] = value
    
    def get(self, key: str, default=None):
        """Get configuration value by dot notation"""
        keys = key.split('.')
        value = self.config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default
        return value if value is not None else default
    
    def set(self, key: str, value):
        """Set configuration value by dot notation"""
        keys = key.split('.')
        config = self.config
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        config[keys[-1]] = value
