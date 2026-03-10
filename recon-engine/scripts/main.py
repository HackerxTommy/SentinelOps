#!/usr/bin/env python3
"""
Main orchestration script for SecureVault Reconnaissance Engine
Coordinates all reconnaissance tools in Docker isolated containers
"""

import sys
import os
import json
import asyncio
from datetime import datetime
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.config import Config
from utils.logger import Logger
from tools.subdomain_discovery import SubdomainDiscovery
from tools.port_scanning import PortScanner
from tools.web_crawling import WebCrawler
from tools.vulnerability_scanning import VulnerabilityScanner
from tools.directory_bruteforce import DirectoryBruteforcer
from tools.cve_lookup import CVELookup
from tools.exploit_lookup import ExploitLookup


class ReconEngine:
    """Main reconnaissance engine orchestrator"""
    
    def __init__(self, target: str, config: dict = None):
        self.target = target
        self.config = config or {}
        self.logger = Logger(__name__)
        self.results = {
            'target': target,
            'timestamp': datetime.utcnow().isoformat(),
            'subdomains': [],
            'ports': [],
            'urls': [],
            'vulnerabilities': [],
            'directories': [],
            'cves': [],
            'exploits': []
        }
        
    async def run_full_recon(self):
        """Run complete reconnaissance pipeline"""
        self.logger.info(f"Starting full reconnaissance for {self.target}")
        
        # Phase 1: Subdomain Discovery
        self.logger.info("Phase 1: Subdomain Discovery")
        subdomain_tool = SubdomainDiscovery(self.target, self.config)
        self.results['subdomains'] = await subdomain_tool.discover()
        
        # Phase 2: Port Scanning
        self.logger.info("Phase 2: Port Scanning")
        port_scanner = PortScanner(self.target, self.config)
        self.results['ports'] = await port_scanner.scan()
        
        # Phase 3: Web Crawling
        self.logger.info("Phase 3: Web Crawling")
        crawler = WebCrawler(self.target, self.config)
        self.results['urls'] = await crawler.crawl()
        
        # Phase 4: Vulnerability Scanning
        self.logger.info("Phase 4: Vulnerability Scanning")
        vuln_scanner = VulnerabilityScanner(self.target, self.config)
        self.results['vulnerabilities'] = await vuln_scanner.scan()
        
        # Phase 5: Directory Bruteforce
        self.logger.info("Phase 5: Directory Bruteforce")
        bruteforcer = DirectoryBruteforcer(self.target, self.config)
        self.results['directories'] = await bruteforcer.bruteforce()
        
        # Phase 6: CVE Lookup
        self.logger.info("Phase 6: CVE Database Lookup")
        cve_lookup = CVELookup(self.config)
        self.results['cves'] = await cve_lookup.search(self.target)
        
        # Phase 7: Exploit Lookup
        self.logger.info("Phase 7: Exploit Database Lookup")
        exploit_lookup = ExploitLookup(self.config)
        self.results['exploits'] = await exploit_lookup.search(self.target)
        
        self.logger.info("Reconnaissance completed successfully")
        return self.results
    
    def save_results(self, output_dir: str = '/app/output'):
        """Save results to JSON file"""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        filename = f"recon_{self.target.replace('.', '_')}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
        filepath = output_path / filename
        
        with open(filepath, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        self.logger.info(f"Results saved to {filepath}")
        return str(filepath)


async def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='SecureVault Reconnaissance Engine')
    parser.add_argument('target', help='Target domain or IP')
    parser.add_argument('--output', '-o', default='/app/output', help='Output directory')
    parser.add_argument('--config', '-c', help='Configuration file')
    parser.add_argument('--phase', '-p', choices=['all', 'subdomains', 'ports', 'crawl', 'vulns', 'dirs', 'cves', 'exploits'], default='all', help='Run specific phase')
    
    args = parser.parse_args()
    
    # Load configuration
    config = {}
    if args.config:
        with open(args.config, 'r') as f:
            config = json.load(f)
    
    # Initialize engine
    engine = ReconEngine(args.target, config)
    
    # Run reconnaissance
    if args.phase == 'all':
        results = await engine.run_full_recon()
    else:
        # Run specific phase
        results = await run_single_phase(engine, args.phase)
    
    # Save results
    engine.save_results(args.output)
    
    # Print summary
    print(json.dumps(results, indent=2))


async def run_single_phase(engine, phase):
    """Run a single reconnaissance phase"""
    if phase == 'subdomains':
        tool = SubdomainDiscovery(engine.target, engine.config)
        return await tool.discover()
    elif phase == 'ports':
        tool = PortScanner(engine.target, engine.config)
        return await tool.scan()
    elif phase == 'crawl':
        tool = WebCrawler(engine.target, engine.config)
        return await tool.crawl()
    elif phase == 'vulns':
        tool = VulnerabilityScanner(engine.target, engine.config)
        return await tool.scan()
    elif phase == 'dirs':
        tool = DirectoryBruteforcer(engine.target, engine.config)
        return await tool.bruteforce()
    elif phase == 'cves':
        tool = CVELookup(engine.config)
        return await tool.search(engine.target)
    elif phase == 'exploits':
        tool = ExploitLookup(engine.config)
        return await tool.search(engine.target)


if __name__ == '__main__':
    asyncio.run(main())
