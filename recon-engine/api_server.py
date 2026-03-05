#!/usr/bin/env python3
"""
Flask API server for SecureVault Reconnaissance Engine
Accepts HTTP requests and runs reconnaissance tasks
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
import sys
import os
from datetime import datetime

# Add scripts to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from scripts.main import ReconEngine

app = Flask(__name__)
CORS(app)


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'securevault-recon-engine'
    })


@app.route('/api/recon', methods=['POST'])
def run_recon():
    """Run reconnaissance on a target"""
    try:
        data = request.get_json()
        target = data.get('target')
        phase = data.get('phase', 'all')
        
        if not target:
            return jsonify({
                'success': False,
                'message': 'Target is required'
            }), 400
        
        # Run reconnaissance
        engine = ReconEngine(target)
        results = asyncio.run(engine.run_full_recon())
        
        return jsonify({
            'success': True,
            'results': results
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/api/recon/<target>', methods=['GET'])
def get_recon(target):
    """Run reconnaissance via GET request"""
    try:
        phase = request.args.get('phase', 'all')
        
        # Run reconnaissance
        engine = ReconEngine(target)
        results = asyncio.run(engine.run_full_recon())
        
        return jsonify({
            'success': True,
            'results': results
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
