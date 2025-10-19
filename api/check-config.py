"""
Diagnostic endpoint to check if environment variables are loaded
"""

from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    
    def _set_headers(self, status_code=200, content_type='application/json'):
        self.send_response(status_code)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self._set_headers(204)
    
    def do_GET(self):
        """Check if environment variables are configured"""
        github_token = os.environ.get('GITHUB_TOKEN')
        github_repo = os.environ.get('GITHUB_REPO')
        
        response = {
            'configured': bool(github_token and github_repo),
            'has_token': bool(github_token),
            'has_repo': bool(github_repo),
            'repo_value': github_repo if github_repo else 'NOT SET',
            'token_length': len(github_token) if github_token else 0,
            'message': 'Environment variables are properly configured!' if (github_token and github_repo) else 'Missing environment variables'
        }
        
        self._set_headers(200)
        self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))
