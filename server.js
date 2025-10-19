// =====================================================
// ProView Cadence - Dynamic Backend Server
// Node.js + Express Server for Real-time Updates
// =====================================================

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8080;
const DATA_FILE = path.join(__dirname, 'data', 'data.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// =====================================================
// API Routes
// =====================================================

// GET - Fetch current data
app.get('/api/data', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// POST - Save updated data
app.post('/api/data', async (req, res) => {
    try {
        const newData = req.body;
        
        // Validate JSON
        if (!newData || typeof newData !== 'object') {
            return res.status(400).json({ error: 'Invalid data format' });
        }
        
        // Backup old data
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(__dirname, 'data', `data-backup-${timestamp}.json`);
        
        try {
            const oldData = await fs.readFile(DATA_FILE, 'utf8');
            await fs.writeFile(backupFile, oldData);
            console.log(`✅ Backup created: ${backupFile}`);
        } catch (backupError) {
            console.warn('Warning: Could not create backup:', backupError.message);
        }
        
        // Write new data
        await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2));
        console.log('✅ Data updated successfully!');
        
        res.json({ 
            success: true, 
            message: 'Data saved successfully!',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// GET - List backups
app.get('/api/backups', async (req, res) => {
    try {
        const dataDir = path.join(__dirname, 'data');
        const files = await fs.readdir(dataDir);
        const backups = files
            .filter(file => file.startsWith('data-backup-'))
            .sort()
            .reverse();
        
        res.json({ backups });
    } catch (error) {
        console.error('Error listing backups:', error);
        res.status(500).json({ error: 'Failed to list backups' });
    }
});

// POST - Restore from backup
app.post('/api/restore', async (req, res) => {
    try {
        const { filename } = req.body;
        const backupFile = path.join(__dirname, 'data', filename);
        
        // Read backup
        const backupData = await fs.readFile(backupFile, 'utf8');
        
        // Restore
        await fs.writeFile(DATA_FILE, backupData);
        console.log(`✅ Restored from backup: ${filename}`);
        
        res.json({ 
            success: true, 
            message: 'Data restored successfully!' 
        });
    } catch (error) {
        console.error('Error restoring backup:', error);
        res.status(500).json({ error: 'Failed to restore backup' });
    }
});

// =====================================================
// Start Server
// =====================================================
app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('🚀 ProView Cadence Server Running!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`📍 Main Website:    http://localhost:${PORT}`);
    console.log(`⚙️  Admin Panel:     http://localhost:${PORT}/admin.html`);
    console.log(`📡 API Endpoint:    http://localhost:${PORT}/api/data`);
    console.log('═══════════════════════════════════════════════════');
    console.log('✨ Changes made in Admin Panel will update instantly!');
    console.log('🔄 Press Ctrl+C to stop the server');
    console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n✅ Server stopped gracefully');
    process.exit(0);
});
