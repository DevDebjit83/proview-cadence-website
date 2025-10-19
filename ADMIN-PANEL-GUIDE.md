# Admin Panel Guide - ProView Cadence

## 🔐 Login Credentials
- **Username:** `admin`
- **Password:** `proview2024`

## 📝 How to Update Website Content

### Important: How Changes Work

**The admin panel does NOT automatically update your website!** This is a static website, so you need to manually replace the data file. Here's the process:

### Step-by-Step Process:

1. **Login to Admin Panel**
   - Go to `http://localhost:8080/admin.html`
   - Enter username and password

2. **Make Your Changes**
   - Edit any section (Services, Projects, News Ticker, etc.)
   - Click the individual "Save" buttons for each section
   - You'll see confirmation messages

3. **Download Updated Data**
   - Click the **"Save All Changes"** button at the top right
   - A file named `data.json` will download to your Downloads folder

4. **Replace the Old File**
   - Navigate to: `/home/debjitdebbarman/Desktop/NICT Computer Services/data/`
   - **Backup the old data.json** (optional but recommended)
   - Copy the new `data.json` from Downloads to the `data/` folder
   - Replace the existing file

5. **Refresh Your Website**
   - Go back to `http://localhost:8080`
   - Press `Ctrl + F5` (hard refresh) to see changes
   - Your updates should now be visible!

## 🎯 Quick Terminal Command

Instead of manually copying, you can use this command:

```bash
cp ~/Downloads/data.json "/home/debjitdebbarman/Desktop/NICT Computer Services/data/data.json"
```

Then refresh the website with `Ctrl + F5`

## ✨ Features You Can Edit:

### 1. News Ticker
- Edit the scrolling text at the top
- Enable/disable the ticker
- Preview changes before saving

### 2. Projects
- Add/Edit/Delete projects
- Add GitHub repository links
- Add Live Demo links
- Only projects with links will show buttons

### 3. Services
- Edit service descriptions
- Add/remove service details
- Change service icons

### 4. Testimonials
- Add customer reviews
- Edit ratings and feedback

### 5. Gallery
- Add/remove images
- Edit image descriptions

### 6. Contact Information
- Update email, phone, address
- Edit social media links
- WhatsApp number

### 7. Website Settings
- Logo (text or image)
- Hero slider images
- Statistics

## ⚠️ Common Issues:

### "My changes aren't showing!"
- Did you click "Save All Changes" and download the file?
- Did you replace the old data.json in the data/ folder?
- Did you hard refresh the website (Ctrl + F5)?

### "The download didn't work"
- Check your Downloads folder
- Some browsers block automatic downloads
- Try clicking "Save All Changes" again

### "I made a mistake!"
- Don't panic! Just reload the admin panel
- Your original data.json is still safe until you replace it
- You can keep backups of data.json files

## 🚀 Pro Tips:

1. **Always backup** your data.json before making major changes
2. **Test locally** before deploying to production
3. **Use the preview features** (like News Ticker preview) before saving
4. **Save frequently** - click individual save buttons as you work
5. **Keep multiple versions** of data.json with dates in filenames

## 📂 File Structure:

```
NICT Computer Services/
├── data/
│   └── data.json          ← Replace this file after downloading
├── admin.html             ← Admin panel
├── index.html             ← Main website
└── ...
```

## 🆘 Need Help?

If changes still aren't showing:
1. Check browser console (F12) for errors
2. Verify data.json is valid JSON (use jsonlint.com)
3. Make sure the server is running (python3 -m http.server 8080)
4. Clear browser cache completely

---

**Remember:** This is a client-side static website. All data is stored in `data.json`. The admin panel is just a convenient interface to edit that file - you still need to manually replace it!
