"""Directory bruteforcing using ffuf, gobuster, and dirsearch"""
import asyncio
import subprocess
import json
from typing import List, Dict
from utils.logger import Logger


class DirectoryBruteforcer:
    """Directory bruteforce tool using ffuf, gobuster, and dirsearch"""
    
    def __init__(self, target: str, config: dict):
        self.target = target
        self.config = config
        self.logger = Logger(__name__)
    
    async def bruteforce(self) -> List[Dict]:
        """Bruteforce directories using multiple tools"""
        self.logger.info(f"Starting directory bruteforce for {self.target}")
        
        results = []
        
        # FFUF
        if self.config.get('tools.ffuf.enabled', True):
            self.logger.info("Running ffuf for directory bruteforce")
            ffuf_results = await self._run_ffuf()
            results.extend(ffuf_results)
        
        # Gobuster
        if self.config.get('tools.gobuster.enabled', True):
            self.logger.info("Running gobuster for directory bruteforce")
            gobuster_results = await self._run_gobuster()
            results.extend(gobuster_results)
        
        # Dirsearch
        if self.config.get('tools.dirsearch.enabled', True):
            self.logger.info("Running dirsearch for directory bruteforce")
            dirsearch_results = await self._run_dirsearch()
            results.extend(dirsearch_results)
        
        self.logger.info(f"Directory bruteforce completed, found {len(results)} directories")
        return results
    
    async def _run_ffuf(self) -> List[Dict]:
        """Run ffuf for directory bruteforce"""
        try:
            wordlist = self.config.get('tools.ffuf.wordlist', '/usr/share/wordlists/dirb/common.txt')
            cmd = ['ffuf', '-u', f'{self.target}/FUZZ', '-w', wordlist, '-mc', '200,301,302,403', '-o', '/tmp/ffuf_output.json', '-of', 'json']
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await result.communicate()
            
            try:
                with open('/tmp/ffuf_output.json', 'r') as f:
                    ffuf_data = json.load(f)
                    
                results = []
                for result in ffuf_data.get('results', []):
                    results.append({
                        'url': result.get('url', ''),
                        'status': result.get('status', ''),
                        'length': result.get('length', ''),
                        'words': result.get('words', ''),
                        'scanner': 'ffuf'
                    })
                
                return results
            except FileNotFoundError:
                self.logger.warning("FFUF output file not found, parsing stdout")
                return self._parse_ffuf_text(stdout.decode())
        except Exception as e:
            self.logger.error(f"FFUF error: {e}")
            return []
    
    def _parse_ffuf_text(self, output: str) -> List[Dict]:
        """Parse ffuf text output"""
        results = []
        lines = output.split('\n')
        for line in lines:
            if 'Status' in line and self.target in line:
                parts = line.split()
                if len(parts) >= 2:
                    results.append({
                        'url': parts[-1],
                        'status': parts[0],
                        'scanner': 'ffuf'
                    })
        return results
    
    async def _run_gobuster(self) -> List[Dict]:
        """Run gobuster for directory bruteforce"""
        try:
            wordlist = self.config.get('tools.gobuster.wordlist', '/usr/share/wordlists/dirb/common.txt')
            cmd = ['gobuster', 'dir', '-u', self.target, '-w', wordlist, '-o', '/tmp/gobuster_output.txt', '-t', '10']
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await result.communicate()
            
            try:
                with open('/tmp/gobuster_output.txt', 'r') as f:
                    gobuster_output = f.read()
                    
                results = []
                lines = gobuster_output.split('\n')
                for line in lines:
                    if 'Status:' in line:
                        parts = line.split()
                        if len(parts) >= 4:
                            results.append({
                                'path': parts[0],
                                'status': parts[2],
                                'size': parts[3],
                                'scanner': 'gobuster'
                            })
                
                return results
            except FileNotFoundError:
                return self._parse_gobuster_text(stdout.decode())
        except Exception as e:
            self.logger.error(f"Gobuster error: {e}")
            return []
    
    def _parse_gobuster_text(self, output: str) -> List[Dict]:
        """Parse gobuster text output"""
        results = []
        lines = output.split('\n')
        for line in lines:
            if 'Status:' in line:
                parts = line.split()
                if len(parts) >= 4:
                    results.append({
                        'path': parts[0],
                        'status': parts[2],
                        'size': parts[3],
                        'scanner': 'gobuster'
                    })
        return results
    
    async def _run_dirsearch(self) -> List[Dict]:
        """Run dirsearch for directory bruteforce"""
        try:
            cmd = ['dirsearch', '-u', self.target, '--format', 'json', '-o', '/tmp/dirsearch_output.json']
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await result.communicate()
            
            try:
                with open('/tmp/dirsearch_output.json', 'r') as f:
                    dirsearch_data = json.load(f)
                    
                results = []
                for result in dirsearch_data.get('results', []):
                    results.append({
                        'path': result.get('path', ''),
                        'status': result.get('status', ''),
                        'content_length': result.get('content-length', ''),
                        'scanner': 'dirsearch'
                    })
                
                return results
            except FileNotFoundError:
                return self._parse_dirsearch_text(stdout.decode())
        except Exception as e:
            self.logger.error(f"Dirsearch error: {e}")
            return []
    
    def _parse_dirsearch_text(self, output: str) -> List[Dict]:
        """Parse dirsearch text output"""
        results = []
        lines = output.split('\n')
        for line in lines:
            if '[' in line and ']' in line:
                parts = line.split()
                if len(parts) >= 3:
                    results.append({
                        'path': parts[-1],
                        'status': parts[0].strip('[]'),
                        'scanner': 'dirsearch'
                    })
        return results
