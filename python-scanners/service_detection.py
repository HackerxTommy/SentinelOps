import sys
import json
import argparse

PORT_MAP = {
    22: "SSH",
    80: "HTTP",
    443: "HTTPS",
    3306: "MySQL",
    5432: "PostgreSQL",
    27017: "MongoDB",
    6379: "Redis",
    8080: "Tomcat"
}

def detect_service(ip, port):
    service = PORT_MAP.get(int(port), "unknown")
    return {"ip": ip, "port": int(port), "service": service, "version": "unknown", "error": None}

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip", required=True)
    parser.add_argument("--port", required=True)
    args = parser.parse_args()
    
    try:
        result = detect_service(args.ip, args.port)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"ip": args.ip, "port": int(args.port), "service": "unknown", "version": "unknown", "error": str(e)}))
