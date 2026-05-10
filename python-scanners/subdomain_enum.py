import sys
import json
import argparse
# pyrefly: ignore [missing-import]
import dns.resolver

WORDLIST = ["www", "api", "admin", "mail", "dev", "test", "staging", "app", "blog", "shop"]

def enum_subdomains(domain):
    subdomains = []
    resolver = dns.resolver.Resolver()
    resolver.timeout = 2.0
    resolver.lifetime = 2.0
    
    for sub in WORDLIST:
        target = f"{sub}.{domain}"
        try:
            answers = resolver.resolve(target, 'A')
            for rdata in answers:
                subdomains.append({"name": target, "ip": rdata.to_text()})
                break # Only need first IP for simple enum
        except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer, dns.resolver.NoNameservers, dns.exception.Timeout):
            continue
        except Exception:
            continue
            
    return {"domain": domain, "subdomains": subdomains, "error": None}

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--domain", required=True)
    args = parser.parse_args()
    
    try:
        result = enum_subdomains(args.domain)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"domain": args.domain, "subdomains": [], "error": str(e)}))
