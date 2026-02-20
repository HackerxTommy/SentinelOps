import sys
import json
import socket
import argparse

def scan_ports(target, ports):
    open_ports = []
    closed_ports = []
    
    for port in ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1.0)
            result = sock.connect_ex((target, int(port)))
            if result == 0:
                open_ports.append(int(port))
            else:
                closed_ports.append(int(port))
            sock.close()
        except Exception:
            closed_ports.append(int(port))
            
    return {"target": target, "open_ports": open_ports, "closed_ports": closed_ports, "error": None}

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--target", required=True)
    parser.add_argument("--ports", required=True)
    args = parser.parse_args()
    
    try:
        ports_list = [p.strip() for p in args.ports.split(",")]
        result = scan_ports(args.target, ports_list)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"target": args.target, "open_ports": [], "closed_ports": [], "error": str(e)}))
