"""Subdomain discovery using subfinder, dnsx, and other tools"""
import asyncio
import subprocess
import json
from typing import List
from utils.logger import Logger


class SubdomainDiscovery:
    """Subdomain discovery tool"""
    
    def __init__(self, target: str, config: dict):
        self.target = target
        self.config = config
        self.logger = Logger(__name__)
    
    async def discover(self) -> List[dict]:
        """Discover subdomains using multiple tools"""
        self.logger.info(f"Starting subdomain discovery for {self.target}")
        
        subdomains = set()
        results = []
        
        # Subfinder
        if self.config.get('tools.subfinder.enabled', True):
            self.logger.info("Running subfinder")
            subfinder_results = await self._run_subfinder()
            subdomains.update(subfinder_results)
        
        # DNSX
        if self.config.get('tools.dnsx.enabled', True):
            self.logger.info("Running dnsx")
            dnsx_results = await self._run_dnsx(list(subdomains))
            results.extend(dnsx_results)
        
        # Assetfinder
        if self.config.get('tools.assetfinder.enabled', True):
            self.logger.info("Running assetfinder")
            assetfinder_results = await self._run_assetfinder()
            subdomains.update(assetfinder_results)
        
        # Knockpy
        if self.config.get('tools.knockpy.enabled', True):
            self.logger.info("Running knockpy")
            knockpy_results = await self._run_knockpy()
            subdomains.update(knockpy_results)
        
        # crt.sh
        self.logger.info("Querying crt.sh")
        crtsh_results = await self._query_crtsh()
        subdomains.update(crtsh_results)
        
        self.logger.info(f"Found {len(subdomains)} subdomains")
        
        return list(subdomains)
    
    async def _run_subfinder(self) -> List[str]:
        """Run subfinder for subdomain enumeration"""
        try:
            cmd = ['subfinder', '-d', self.target, '-silent', '-json']
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await result.communicate()
            
            if result.returncode != 0:
                self.logger.error(f"Subfinder failed: {stderr.decode()}")
                return []
            
            subdomains = []
            for line in stdout.decode().strip().split('\n'):
                if line:
                    try:
                        data = json.loads(line)
                        subdomains.append(data.get('host', ''))
                    except json.JSONDecodeError:
                        subdomains.append(line)
            
            return subdomains
        except Exception as e:
            self.logger.error(f"Subfinder error: {e}")
            return []
    
    async def _run_dnsx(self, subdomains: List[str]) -> List[dict]:
        """Run dnsx for DNS resolution and filtering"""
        try:
            cmd = ['dnsx', '-silent', '-json', '-resp']
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            input_data = '\n'.join(subdomains).encode()
            stdout, stderr = await result.communicate(input=input_data)
            
            if result.returncode != 0:
                self.logger.error(f"DNSX failed: {stderr.decode()}")
                return []
            
            results = []
            for line in stdout.decode().strip().split('\n'):
                if line:
                    try:
                        data = json.loads(line)
                        results.append(data)
                    except json.JSONDecodeError:
                        pass
            
            return results
        except Exception as e:
            self.logger.error(f"DNSX error: {e}")
            return []
    
    async def _run_assetfinder(self) -> List[str]:
        """Run assetfinder for subdomain discovery"""
        try:
            cmd = ['assetfinder', '--subs-only', self.target]
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await result.communicate()
            
            if result.returncode != 0:
                self.logger.error(f"Assetfinder failed: {stderr.decode()}")
                return []
            
            subdomains = stdout.decode().strip().split('\n')
            return [s for s in subdomains if s]
        except Exception as e:
            self.logger.error(f"Assetfinder error: {e}")
            return []
    
    async def _run_knockpy(self) -> List[str]:
        """Run knockpy for subdomain enumeration"""
        try:
            cmd = ['knockpy', self.target, '--no-bruteforce']
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await result.communicate()
            
            if result.returncode != 0:
                self.logger.error(f"Knockpy failed: {stderr.decode()}")
                return []
            
            subdomains = []
            for line in stdout.decode().strip().split('\n'):
                if self.target in line:
                    subdomains.append(line.strip())
            
            return subdomains
        except Exception as e:
            self.logger.error(f"Knockpy error: {e}")
            return []
    
    async def _query_crtsh(self) -> List[str]:
        """Query crt.sh for subdomain certificates"""
        try:
            import aiohttp
            
            url = f"https://crt.sh/?q=%.{self.target}&output=json"
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        self.logger.error(f"crt.sh query failed: {response.status}")
                        return []
                    
                    data = await response.json()
                    subdomains = set()
                    for cert in data:
                        name_value = cert.get('name_value', '')
                        for subdomain in name_value.split('\n'):
                            if subdomain and subdomain not in subdomains:
                                subdomains.add(subdomain)
                    
                    return list(subdomains)
        except Exception as e:
            self.logger.error(f"crt.sh error: {e}")
            return []
