#!/usr/bin/env python3
"""
ProView Cadence - Dynamic Backend Server
Pure Python HTTP Server for Real-time Updates (No Dependencies)
"""

import http.server
import socketserver
import json
import os
import urllib.parse
from datetime import datetime
import shutil
import mimetypes

PORT = 8080
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'data.json')
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

class DynamicHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP handler for dynamic content"""
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/api/data':
            self.handle_get_data()
        elif self.path == '/api/backups':
            self.handle_list_backups()
        else:
            # Serve static files
            super().do_GET()
    
    def do_POST(self):
        """Handle POST requests"""
        if self.path == '/api/data':
            self.handle_save_data()
        elif self.path == '/api/restore':
            self.handle_restore_backup()
        else:
            self.send_error(404, "Endpoint not found")
    
    def handle_get_data(self):
        """Fetch current data"""
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
            print('✅ Data fetched successfully')
        except Exception as e:
            print(f'❌ Error reading data: {e}')
            self.send_error(500, str(e))
    
    def handle_save_data(self):
        """Save updated data"""
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            new_data = json.loads(post_data.decode('utf-8'))
            
            if not isinstance(new_data, dict):
                self.send_error(400, "Invalid data format")
                return
            
            # Create backup
            timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
            backup_file = os.path.join(DATA_DIR, f'data-backup-{timestamp}.json')
            
            try:
                shutil.copy2(DATA_FILE, backup_file)
                print(f'✅ Backup created: {backup_file}')
            except Exception as backup_error:
                print(f'⚠️  Warning: Could not create backup: {backup_error}')
            
            # Write new data
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(new_data, f, indent=2, ensure_ascii=False)
            
            print('✅ Data updated successfully!')
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                'success': True,
                'message': 'Data saved successfully!',
                'timestamp': timestamp
            }
            self.wfile.write(json.dumps(response).encode())
        except json.JSONDecodeError:
            print('❌ Error: Invalid JSON')
            self.send_error(400, "Invalid JSON")
        except Exception as e:
            print(f'❌ Error saving data: {e}')
            self.send_error(500, str(e))
    
    def handle_list_backups(self):
        """List all backup files"""
        try:
            files = os.listdir(DATA_DIR)
            backups = sorted(
                [f for f in files if f.startswith('data-backup-')],
                reverse=True
            )
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'backups': backups}).encode())
        except Exception as e:
            print(f'❌ Error listing backups: {e}')
            self.send_error(500, str(e))
    
    def handle_restore_backup(self):
        """Restore from backup"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            filename = request_data.get('filename')
            backup_file = os.path.join(DATA_DIR, filename)
            
            if not os.path.exists(backup_file):
                self.send_error(404, "Backup file not found")
                return
            
            shutil.copy2(backup_file, DATA_FILE)
            print(f'✅ Restored from backup: {filename}')
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                'success': True,
                'message': 'Data restored successfully!'
            }
            self.wfile.write(json.dumps(response).encode())
        except Exception as e:
            print(f'❌ Error restoring backup: {e}')
            self.send_error(500, str(e))

def main():
    """Start the server"""
    # Change to script directory
    os.chdir(os.path.dirname(__file__) or '.')
    
    # Create server
    with socketserver.TCPServer(("", PORT), DynamicHTTPRequestHandler) as httpd:
        print('')
        print('═══════════════════════════════════════════════════')
        print('🚀 ProView Cadence Dynamic Server Running!')
        print('═══════════════════════════════════════════════════')
        print(f'📍 Main Website:    http://localhost:{PORT}')
        print(f'⚙️  Admin Panel:     http://localhost:{PORT}/admin.html')
        print(f'📡 API Endpoint:    http://localhost:{PORT}/api/data')
        print('═══════════════════════════════════════════════════')
        print('✨ Changes in Admin Panel update INSTANTLY!')
        print('💾 Automatic backups created on every save')
        print('🔄 Press Ctrl+C to stop the server')
        print('')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n\n✅ Server stopped gracefully')

if __name__ == '__main__':
    main()
