"""
ProView Cadence - Vercel Serverless API
Handles dynamic data updates for the website
"""

from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime

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
        """Handle POST requests - update data"""
        try:
            # Read the request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            new_data = json.loads(post_data.decode('utf-8'))
            
            # Get the data file path
            data_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'data.json')
            
            # Create backup
            backup_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
            timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
            backup_file = os.path.join(backup_dir, f'data-backup-{timestamp}.json')
            
            # Backup current data
            if os.path.exists(data_file):
                with open(data_file, 'r', encoding='utf-8') as f:
                    current_data = f.read()
                with open(backup_file, 'w', encoding='utf-8') as f:
                    f.write(current_data)
            
            # Write new data
            with open(data_file, 'w', encoding='utf-8') as f:
                json.dump(new_data, f, indent=2, ensure_ascii=False)
            
            self._set_headers(200)
            response = {
                'success': True,
                'message': 'Data updated successfully',
                'backup': f'data-backup-{timestamp}.json',
                'timestamp': timestamp
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            self._set_headers(500)
            error_response = {
                'success': False,
                'error': str(e),
                'message': 'Error updating data'
            }
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
