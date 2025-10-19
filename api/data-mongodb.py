"""
ProView Cadence - MongoDB-Powered Dynamic API
This version uses MongoDB Atlas for true dynamic updates on Vercel

Setup:
1. Create MongoDB Atlas account (free): https://www.mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Add MONGODB_URI to Vercel environment variables
4. Deploy!
"""

from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime

# Try to import pymongo
try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure
    MONGODB_AVAILABLE = True
except ImportError:
    MONGODB_AVAILABLE = False

class handler(BaseHTTPRequestHandler):
    
    def _set_headers(self, status_code=200, content_type='application/json'):
        self.send_response(status_code)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_OPTIONS(self):
        self._set_headers(204)
    
    def get_mongodb_client(self):
        """Get MongoDB client connection"""
        mongodb_uri = os.environ.get('MONGODB_URI')
        if not mongodb_uri:
            return None
        
        try:
            client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
            # Test connection
            client.server_info()
            return client
        except:
            return None
    
    def do_GET(self):
        """Handle GET requests - return current data"""
        try:
            # Try MongoDB first
            if MONGODB_AVAILABLE:
                client = self.get_mongodb_client()
                if client:
                    db = client['proview_cadence']
                    collection = db['site_data']
                    
                    # Get latest data
                    data = collection.find_one(
                        {},
                        {'_id': 0},
                        sort=[('updated_at', -1)]
                    )
                    
                    if data:
                        # Remove metadata
                        data.pop('updated_at', None)
                        self._set_headers(200)
                        self.wfile.write(json.dumps(data).encode('utf-8'))
                        client.close()
                        return
                    
                    client.close()
            
            # Fallback to static file
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
                'message': 'Error reading data'
            }
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_POST(self):
        """Handle POST requests - update data in MongoDB"""
        try:
            # Read the request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            new_data = json.loads(post_data.decode('utf-8'))
            
            # Try MongoDB
            if MONGODB_AVAILABLE:
                client = self.get_mongodb_client()
                if client:
                    db = client['proview_cadence']
                    collection = db['site_data']
                    
                    # Add timestamp
                    new_data['updated_at'] = datetime.utcnow()
                    
                    # Create backup before update
                    backup_collection = db['site_data_backups']
                    current_data = collection.find_one({}, sort=[('updated_at', -1)])
                    if current_data:
                        current_data['backup_created_at'] = datetime.utcnow()
                        backup_collection.insert_one(current_data)
                    
                    # Insert new data
                    collection.insert_one(new_data)
                    
                    self._set_headers(200)
                    response = {
                        'success': True,
                        'message': 'Data updated successfully in MongoDB',
                        'timestamp': new_data['updated_at'].isoformat(),
                        'database': 'mongodb'
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    client.close()
                    return
            
            # MongoDB not available
            self._set_headers(200)
            response = {
                'success': False,
                'readonly': True,
                'message': 'MongoDB not configured. Add MONGODB_URI to Vercel environment variables.',
                'instructions': 'See DYNAMIC-DEPLOYMENT-SOLUTIONS.md for setup guide',
                'fallback': 'Edit data/data.json on GitHub and commit to update'
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
