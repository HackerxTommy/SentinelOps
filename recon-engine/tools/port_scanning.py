"""Port scanning using nmap and naabu"""
import asyncio
import subprocess
import json
from typing import List, Dict
from utils.logger import Logger


class PortScanner:
    """Port scanning tool using nmap"""
    
    def __init__(self, target: str, config: dict):
        self.target = target
        self.config = config
        self.logger = Logger(__name__)
    
    async def scan(self) -> List[Dict]:
        """Scan target for open ports using nmap"""
        self.logger.info(f"Starting port scan for {self.target}")
        
        results = []
        
        # Naabu for fast port discovery
        if self.config.get('tools.naabu.enabled', True):
            self.logger.info("Running naabu for port discovery")
            naabu_results = await self._run_naabu()
            if naabu_results:
                results.extend(naabu_results)
        
        # Nmap for detailed scanning
        if self.config.get('tools.nmap.enabled', True):
            self.logger.info("Running nmap for detailed scanning")
            nmap_results = await self._run_nmap()
            if nmap_results:
                results.extend(nmap_results)
        
        self.logger.info(f"Port scan completed, found {len(results)} open ports")
        return results
    
    async def _run_naabu(self) -> List[Dict]:
        """Run naabu for fast port discovery"""
        try:
            cmd = ['naabu', '-host', self.target, '-silent', '-json']
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await result.communicate()
            
            if result.returncode != 0:
                self.logger.error(f"Naabu failed: {stderr.decode()}")
                return []
            
            results = []
            for line in stdout.decode().strip().split('\n'):
                if line:
                    try:
                        data = json.loads(line)
                        results.append({
                            'host': data.get('host', self.target),
                            'port': data.get('port'),
                            'protocol': 'tcp',
                            'scanner': 'naabu'
                        })
                    except json.JSONDecodeError:
                        pass
            
            return results
        except Exception as e:
            self.logger.error(f"Naabu error: {e}")
            return []
    
    async def _run_nmap(self) -> List[Dict]:
        """Run nmap for detailed port and service scanning"""
        try:
            scan_type = self.config.get('tools.nmap.scan_type', '-sS -sV')
            ports = self.config.get('tools.nmap.ports', '1-65535')
            
            cmd = ['nmap', '-p', ports, scan_type, '-oX', '-', self.target]
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await result.communicate()
            
            if result.returncode != 0:
                self.logger.error(f"Nmap failed: {stderr.decode()}")
                return []
            
            return self._parse_nmap_xml(stdout.decode())
        except Exception as e:
            self.logger.error(f"Nmap error: {e}")
            return []
    
    def _parse_nmap_xml(self, xml_output: str) -> List[Dict]:
        """Parse nmap XML output"""
        try:
            import xml.etree.ElementTree as ET
            root = ET.fromstring(xml_output)
            results = []
            
            for port in root.findall('.//port'):
                port_id = port.get('portid')
                protocol = port.get('protocol')
                state = port.find('state')
                service = port.find('service')
                
                results.append({
                    'host': self.target,
                    'port': int(port_id),
                    'protocol': protocol,
                    'state': state.get('state') if state is not None else 'unknown',
                    'service': service.get('name') if service is not None else 'unknown',
                    'product': service.get('product') if service is not None else None,
                    'version': service.get('version') if service is not None else None,
                    'scanner': 'nmap'
                })
            
            return results
        except Exception as e:
            self.logger.error(f"Failed to parse nmap XML: {e}")
            return []
