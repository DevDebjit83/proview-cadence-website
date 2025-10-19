"""
ProView Cadence - Vercel Serverless API
Handles dynamic data updates for the website
Note: Vercel serverless functions are READ-ONLY
For dynamic updates, this returns data and instructions for GitHub-based updates
"""

from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    
    def _set_headers(self, status_code=200, content_type='application/json'):
        self.send_response(status_code)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        self._set_headers(204)
    
    def do_GET(self):
        """Handle GET requests - return current data"""
        try:
            # Get the data file path
            data_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'data.json')
            
            with open(data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self._set_headers(200)
            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        except Exception as e:
            self._set_headers(500)
            error_response = {
                'success': False,
                'error': str(e),
                'message': 'Error reading data file'
            }
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_POST(self):
        """Handle POST requests - Vercel doesn't allow file writes, return info for GitHub update"""
        try:
            # Read the request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            new_data = json.loads(post_data.decode('utf-8'))
            
            self._set_headers(200)
            response = {
                'success': False,
                'readonly': True,
                'message': 'Vercel deployment is read-only. To enable dynamic updates, you need to use a database.',
                'instructions': 'For now, edit data/data.json on GitHub and push changes, or set up a database (MongoDB, Supabase, etc.)',
                'github_repo': 'https://github.com/DevDebjit83/proview-cadence-website',
                'received_data': True
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            self._set_headers(500)
            error_response = {
                'success': False,
                'error': str(e),
                'message': 'Error processing request'
            }
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
