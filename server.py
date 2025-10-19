#!/usr/bin/env python3
"""
ProView Cadence - Dynamic Backend Server
Python + Flask Server for Real-time Updates
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime
import shutil

app = Flask(__name__, static_folder='.')
CORS(app)

DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'data.json')
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

# =====================================================
# API Routes
# =====================================================

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/data', methods=['GET'])
def get_data():
    """Fetch current data"""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        print(f'❌ Error reading data: {e}')
        return jsonify({'error': 'Failed to read data'}), 500

@app.route('/api/data', methods=['POST'])
def save_data():
    """Save updated data"""
    try:
        new_data = request.json
        
        if not new_data or not isinstance(new_data, dict):
            return jsonify({'error': 'Invalid data format'}), 400
        
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
        
        return jsonify({
            'success': True,
            'message': 'Data saved successfully!',
            'timestamp': timestamp
        })
    except Exception as e:
        print(f'❌ Error saving data: {e}')
        return jsonify({'error': 'Failed to save data'}), 500

@app.route('/api/backups', methods=['GET'])
def list_backups():
    """List all backup files"""
    try:
        files = os.listdir(DATA_DIR)
        backups = sorted(
            [f for f in files if f.startswith('data-backup-')],
            reverse=True
        )
        return jsonify({'backups': backups})
    except Exception as e:
        print(f'❌ Error listing backups: {e}')
        return jsonify({'error': 'Failed to list backups'}), 500

@app.route('/api/restore', methods=['POST'])
def restore_backup():
    """Restore from backup"""
    try:
        filename = request.json.get('filename')
        backup_file = os.path.join(DATA_DIR, filename)
        
        if not os.path.exists(backup_file):
            return jsonify({'error': 'Backup file not found'}), 404
        
        shutil.copy2(backup_file, DATA_FILE)
        print(f'✅ Restored from backup: {filename}')
        
        return jsonify({
            'success': True,
            'message': 'Data restored successfully!'
        })
    except Exception as e:
        print(f'❌ Error restoring backup: {e}')
        return jsonify({'error': 'Failed to restore backup'}), 500

# =====================================================
# Start Server
# =====================================================
if __name__ == '__main__':
    print('')
    print('═══════════════════════════════════════════════════')
    print('🚀 ProView Cadence Server Running!')
    print('═══════════════════════════════════════════════════')
    print(f'📍 Main Website:    http://localhost:8080')
    print(f'⚙️  Admin Panel:     http://localhost:8080/admin.html')
    print(f'📡 API Endpoint:    http://localhost:8080/api/data')
    print('═══════════════════════════════════════════════════')
    print('✨ Changes made in Admin Panel will update instantly!')
    print('🔄 Press Ctrl+C to stop the server')
    print('')
    
    app.run(host='0.0.0.0', port=8080, debug=True)
