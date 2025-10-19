"""
ProView Cadence - Simple Dynamic API (Vercel Compatible)
SIMPLEST SOLUTION: Uses GitHub to store data dynamically

How it works:
1. Frontend calls this API
2. API updates data.json in GitHub
3. Changes appear on website instantly
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import base64
import urllib.request
import urllib.error

class handler(BaseHTTPRequestHandler):
    
    def _set_headers(self, status_code=200, content_type='application/json'):
        self.send_response(status_code)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self._set_headers(204)
    
    def do_POST(self):
        """Save data to GitHub repository"""
        try:
            # Read request data
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            new_data = json.loads(post_data.decode('utf-8'))
            
            # Get GitHub credentials from environment
            github_token = os.environ.get('GITHUB_TOKEN')
            github_repo = os.environ.get('GITHUB_REPO', 'DevDebjit83/proview-cadence-website')
            
            if not github_token:
                self._set_headers(200)
                response = {
                    'success': False,
                    'message': 'GitHub token not configured. Add GITHUB_TOKEN to Vercel environment variables.',
                    'instructions': 'See deployment guide for setup'
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return
            
            # GitHub API endpoints
            file_path = 'data/data.json'
            api_url = f'https://api.github.com/repos/{github_repo}/contents/{file_path}'
            
            # Get current file SHA (required for update)
            headers = {
                'Authorization': f'token {github_token}',
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'ProView-Cadence-Bot'
            }
            
            req = urllib.request.Request(api_url, headers=headers)
            try:
                response = urllib.request.urlopen(req)
                current_file = json.loads(response.read().decode('utf-8'))
                sha = current_file['sha']
            except urllib.error.HTTPError:
                sha = None  # File doesn't exist, will create new
            
            # Prepare update
            content_bytes = json.dumps(new_data, indent=2, ensure_ascii=False).encode('utf-8')
            content_base64 = base64.b64encode(content_bytes).decode('utf-8')
            
            update_data = {
                'message': 'Update website content via admin panel',
                'content': content_base64,
                'branch': 'main'
            }
            
            if sha:
                update_data['sha'] = sha
            
            # Update file on GitHub
            req = urllib.request.Request(
                api_url,
                data=json.dumps(update_data).encode('utf-8'),
                headers=headers,
                method='PUT'
            )
            
            response = urllib.request.urlopen(req)
            result = json.loads(response.read().decode('utf-8'))
            
            self._set_headers(200)
            response = {
                'success': True,
                'message': 'Data saved successfully! Changes will appear in 30 seconds.',
                'commit': result.get('commit', {}).get('sha', 'unknown')[:7],
                'method': 'github'
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            self._set_headers(500)
            error_response = {
                'success': False,
                'error': str(e),
                'message': 'Error saving data'
            }
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
