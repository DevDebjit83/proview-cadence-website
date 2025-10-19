# 🚀 ProView Cadence - Dynamic Website Guide

## ✨ CONGRATULATIONS! Your Website is Now DYNAMIC!

Your website has been converted from static to **fully dynamic**. Changes made in the Admin Panel now update **INSTANTLY** without downloading any files!

---

## 🎯 Quick Start

### Starting the Dynamic Server

**Method 1: Using the Startup Script (Recommended)**
```bash
cd "/home/debjitdebbarman/Desktop/NICT Computer Services"
./start-dynamic.sh
```

**Method 2: Direct Python Command**
```bash
cd "/home/debjitdebbarman/Desktop/NICT Computer Services"
python3 server-dynamic.py
```

### Accessing Your Website

Once the server is running, open your browser to:
- **Main Website:** http://localhost:8080
- **Admin Panel:** http://localhost:8080/admin.html

---

## 🎨 How It Works Now

### BEFORE (Static):
1. Edit in Admin Panel
2. Click "Save All Changes"
3. Download data.json file
4. Manually replace old file
5. Refresh website
6. **Result:** Changes appear ❌ (Manual process)

### AFTER (Dynamic):
1. Edit in Admin Panel
2. Click "Save All Changes"
3. **Result:** Changes appear INSTANTLY! ✅ (Automatic)

---

## 💾 Automatic Backups

Every time you save changes, the system automatically creates a backup:
- **Location:** `/data/data-backup-YYYY-MM-DD_HH-MM-SS.json`
- **Example:** `data-backup-2025-10-19_14-30-45.json`

You can restore from any backup through the API or manually.

---

## 📝 Making Changes

### Step-by-Step:

1. **Login to Admin Panel**
   - Go to http://localhost:8080/admin.html
   - Username: `admin`
   - Password: `proview2024`

2. **Edit Content**
   - News Ticker
   - Projects (with GitHub & Live links)
   - Services
   - Testimonials
   - Gallery
   - Contact Info
   - Settings

3. **Save**
   - Click individual "Save" buttons as you work
   - Click "Save All Changes" at the top when done
   - You'll see: "✅ Changes saved successfully! Your website has been updated in real-time!"

4. **View Changes**
   - Refresh the main website (F5)
   - Changes appear immediately!

---

## 🔧 Technical Details

### What Changed?

1. **Backend Server (server-dynamic.py)**
   - Pure Python HTTP server (no external dependencies)
   - Handles API requests for data
   - Automatically creates backups
   - CORS enabled for cross-origin requests

2. **Frontend Updates**
   - `js/app.js` - Fetches data from `/api/data`
   - `js/admin.js` - Saves data via POST to `/api/data`
   - Automatic fallback to static mode if server is not running

3. **API Endpoints**
   - `GET  /api/data` - Fetch current data
   - `POST /api/data` - Save updated data
   - `GET  /api/backups` - List all backups
   - `POST /api/restore` - Restore from backup

### Fallback Mode

If the dynamic server is not running, the website automatically falls back to static mode:
- Reads from `data/data.json` directly
- Admin panel downloads files instead of saving directly
- You get a notification: "⚠️ Static Mode: Changes downloaded!"

---

## 🎯 Common Tasks

### Updating News Ticker
1. Admin Panel → News Ticker
2. Edit text, enable/disable
3. Save News Ticker
4. Save All Changes
5. **Done!** Instantly updated

### Adding Project with Links
1. Admin Panel → Projects
2. Click "Add New Project"
3. Fill details including:
   - GitHub Repository Link
   - Live Project Link
4. Save Changes → Save All Changes
5. **Done!** Buttons appear on website

### Viewing Backups
```bash
ls -lh "/home/debjitdebbarman/Desktop/NICT Computer Services/data/"
```

### Restoring a Backup
```bash
cp "/home/debjitdebbarman/Desktop/NICT Computer Services/data/data-backup-2025-10-19_14-30-45.json" \
   "/home/debjitdebbarman/Desktop/NICT Computer Services/data/data.json"
```

---

## 🚨 Troubleshooting

### Server Won't Start
**Error:** "Address already in use"
```bash
# Kill existing server
lsof -ti:8080 | xargs kill -9
# Start again
./start-dynamic.sh
```

### Changes Not Showing
1. Check if dynamic server is running
2. Look for "✅ Changes saved successfully!" message
3. Hard refresh (Ctrl + F5)
4. Check browser console (F12) for errors

### API Not Working
1. Verify server is running: `lsof -i:8080`
2. Check terminal for error messages
3. Test API: `curl http://localhost:8080/api/data`

---

## 📊 Server Management

### Check if Server is Running
```bash
lsof -i:8080
```

### Stop the Server
```bash
# In the terminal where it's running
Press Ctrl+C

# Or kill from another terminal
lsof -ti:8080 | xargs kill -9
```

### View Server Logs
- Watch the terminal where the server is running
- You'll see:
  - ✅ Data fetched successfully
  - ✅ Backup created: filename
  - ✅ Data updated successfully!

---

## 🌟 Benefits of Dynamic Mode

### ✅ Instant Updates
- No file downloads
- No manual file replacement
- Changes appear immediately

### ✅ Automatic Backups
- Every save creates a backup
- Never lose your data
- Easy rollback if needed

### ✅ Better Workflow
- Edit → Save → Done
- No technical steps required
- Non-technical users can manage content

### ✅ Multiple Editors
- Multiple people can edit (one at a time)
- Last save wins
- Backups prevent data loss

---

## 🔐 Security Notes

1. **Production Deployment:**
   - Change admin password in `js/admin.js`
   - Add authentication to API endpoints
   - Use HTTPS
   - Restrict admin panel access

2. **Backup Management:**
   - Backups accumulate over time
   - Periodically clean old backups
   - Store important backups elsewhere

3. **Data Validation:**
   - Server validates JSON before saving
   - Invalid data rejected with error

---

## 🎓 For Developers

### Files Modified
- `server-dynamic.py` - New dynamic backend server
- `js/app.js` - Updated to fetch from API
- `js/admin.js` - Updated to save via API
- `start-dynamic.sh` - Easy startup script

### Original Files (Still Work)
- `data/data.json` - Still the data source
- All HTML, CSS, JS files - Work in both modes
- Static server still available (python3 -m http.server 8080)

### Future Enhancements
- User authentication
- Version control for changes
- Real-time preview
- Multi-user editing
- Database integration

---

## 📞 Quick Reference

```bash
# Start Server
cd "/home/debjitdebbarman/Desktop/NICT Computer Services"
./start-dynamic.sh

# Stop Server
Ctrl+C (in server terminal)
# or
lsof -ti:8080 | xargs kill -9

# View Backups
ls -lh data/data-backup-*.json

# Test API
curl http://localhost:8080/api/data

# View Website
http://localhost:8080

# Admin Panel
http://localhost:8080/admin.html
```

---

## 🎉 You're All Set!

Your website is now fully dynamic. Enjoy instant updates without the hassle of manual file management!

**Need Help?** Check the terminal output for error messages or refer to this guide.

---

**ProView Cadence** - Dynamic Website v2.0
*Built with Python • No External Dependencies*
