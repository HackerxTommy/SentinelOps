"""Web crawling using httpx, katana, and subjs"""
import asyncio
import subprocess
import json
from typing import List, Dict
from utils.logger import Logger


class WebCrawler:
    """Web crawling tool using httpx and katana"""
    
    def __init__(self, target: str, config: dict):
        self.target = target
        self.config = config
        self.logger = Logger(__name__)
    
    async def crawl(self) -> List[Dict]:
        """Crawl target for URLs and endpoints"""
        self.logger.info(f"Starting web crawling for {self.target}")
        
        results = []
        
        # httpx for alive host detection
        if self.config.get('tools.httpx.enabled', True):
            self.logger.info("Running httpx for alive host detection")
            httpx_results = await self._run_httpx()
            results.extend(httpx_results)
        
        # katana for web crawling
        if self.config.get('tools.katana.enabled', True):
            self.logger.info("Running katana for web crawling")
            katana_results = await self._run_katana()
            results.extend(katana_results)
        
        # subjs for JavaScript file discovery
        self.logger.info("Running subjs for JavaScript file discovery")
        subjs_results = await self._run_subjs()
        results.extend(subjs_results)
        
        # wafw00f for WAF detection
        self.logger.info("Running wafw00f for WAF detection")
        waf_results = await self._run_wafw00f()
        if waf_results:
            results.append(waf_results)
        
        self.logger.info(f"Web crawling completed, found {len(results)} URLs/endpoints")
        return results
    
    async def _run_httpx(self) -> List[Dict]:
        """Run httpx for alive host detection"""
        try:
            cmd = ['httpx', '-silent', '-json', '-status-code', '-title']
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            input_data = f"{self.target}\n".encode()
            stdout, stderr = await result.communicate(input=input_data)
            
            if result.returncode != 0:
                self.logger.error(f"httpx failed: {stderr.decode()}")
                return []
            
            results = []
            for line in stdout.decode().strip().split('\n'):
                if line:
                    try:
                        data = json.loads(line)
                        results.append({
                            'url': data.get('url', ''),
                            'status_code': data.get('status_code'),
                            'title': data.get('title', ''),
                            'method': 'httpx'
                        })
                    except json.JSONDecodeError:
                        pass
            
            return results
        except Exception as e:
            self.logger.error(f"httpx error: {e}")
            return []
    
    async def _run_katana(self) -> List[Dict]:
        """Run katana for web crawling"""
        try:
            depth = self.config.get('tools.katana.depth', 3)
            cmd = ['katana', '-u', self.target, '-d', str(depth), '-silent', '-json']
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await result.communicate()
            
            if result.returncode != 0:
                self.logger.error(f"katana failed: {stderr.decode()}")
                return []
            
            results = []
            for line in stdout.decode().strip().split('\n'):
                if line:
                    try:
                        data = json.loads(line)
                        results.append({
                            'url': data.get('url', ''),
                            'method': data.get('method', 'GET'),
                            'method': 'katana'
                        })
                    except json.JSONDecodeError:
                        results.append({
                            'url': line,
                            'method': 'GET',
                            'scanner': 'katana'
                        })
            
            return results
        except Exception as e:
            self.logger.error(f"katana error: {e}")
            return []
    
    async def _run_subjs(self) -> List[Dict]:
        """Run subjs for JavaScript file discovery"""
        try:
            cmd = ['subjs', '-u', self.target, '-silent', '-json']
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await result.communicate()
            
            if result.returncode != 0:
                self.logger.error(f"subjs failed: {stderr.decode()}")
                return []
            
            results = []
            for line in stdout.decode().strip().split('\n'):
                if line:
                    results.append({
                        'url': line,
                        'type': 'javascript',
                        'scanner': 'subjs'
                    })
            
            return results
        except Exception as e:
            self.logger.error(f"subjs error: {e}")
            return []
    
    async def _run_wafw00f(self) -> Dict:
        """Run wafw00f for WAF detection"""
        try:
            cmd = ['wafw00f', self.target]
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await result.communicate()
            
            output = stdout.decode()
            
            return {
                'target': self.target,
                'waf_detected': 'WAF' in output or 'firewall' in output.lower(),
                'details': output,
                'scanner': 'wafw00f'
            }
        except Exception as e:
            self.logger.error(f"wafw00f error: {e}")
            return {}
