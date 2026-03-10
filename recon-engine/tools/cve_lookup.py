"""CVE lookup using NVD database"""
import asyncio
import aiohttp
from typing import List, Dict
from utils.logger import Logger


class CVELookup:
    """CVE lookup tool using NVD database"""
    
    def __init__(self, config: dict):
        self.config = config
        self.logger = Logger(__name__)
        self.nvd_api_url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
    
    async def search(self, target: str) -> List[Dict]:
        """Search for CVEs related to the target"""
        self.logger.info(f"Searching CVEs for {target}")
        
        results = []
        
        # Extract technology stack information from target
        technologies = self._extract_technologies(target)
        
        # Search CVEs for each technology
        for tech in technologies:
            cves = await self._search_nvd(tech)
            results.extend(cves)
        
        self.logger.info(f"Found {len(results)} CVEs")
        return results
    
    def _extract_technologies(self, target: str) -> List[str]:
        """Extract potential technologies from target"""
        technologies = []
        
        # Common web technologies
        common_tech = ['apache', 'nginx', 'iis', 'php', 'nodejs', 'python', 'django', 'flask', 'express', 'wordpress', 'drupal', 'joomla']
        
        # Check if any common tech is in the target
        target_lower = target.lower()
        for tech in common_tech:
            if tech in target_lower:
                technologies.append(tech)
        
        # Add default web server technologies
        if not technologies:
            technologies.extend(['apache', 'nginx', 'iis'])
        
        return technologies
    
    async def _search_nvd(self, keyword: str) -> List[Dict]:
        """Search NVD database for CVEs"""
        try:
            async with aiohttp.ClientSession() as session:
                params = {
                    'keywordSearch': keyword,
                    'resultsPerPage': 20
                }
                
                async with session.get(self.nvd_api_url, params=params) as response:
                    if response.status != 200:
                        self.logger.error(f"NVD API request failed: {response.status}")
                        return []
                    
                    data = await response.json()
                    return self._parse_nvd_response(data)
        except Exception as e:
            self.logger.error(f"NVD API error: {e}")
            return []
    
    def _parse_nvd_response(self, data: Dict) -> List[Dict]:
        """Parse NVD API response"""
        results = []
        
        for item in data.get('vulnerabilities', []):
            cve = item.get('cve', {})
            cve_id = cve.get('id', '')
            
            descriptions = cve.get('descriptions', [])
            description = descriptions[0].get('value', '') if descriptions else ''
            
            metrics = cve.get('metrics', {})
            cvss_score = 0
            severity = 'UNKNOWN'
            
            if metrics:
                for metric in metrics.values():
                    if 'cvssMetricV31' in metric:
                        cvss_data = metric['cvssMetricV31'][0]
                        cvss_score = cvss_data.get('cvssData', {}).get('baseScore', 0)
                        severity = cvss_data.get('cvssData', {}).get('baseSeverity', 'UNKNOWN')
                    elif 'cvssMetricV2' in metric:
                        cvss_data = metric['cvssMetricV2'][0]
                        cvss_score = cvss_data.get('cvssData', {}).get('baseScore', 0)
            
            results.append({
                'cve_id': cve_id,
                'description': description,
                'cvss_score': cvss_score,
                'severity': severity,
                'published': cve.get('published', ''),
                'modified': cve.get('lastModified', ''),
                'source': 'NVD'
            })
        
        return results
