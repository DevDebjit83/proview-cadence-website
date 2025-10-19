# 🎨 LOGO UPLOAD INSTRUCTIONS

## Your ProView Cadence Logo

I've configured the website to display your logo image. 

### Option 1: Manual Upload (Recommended)

1. **Save your logo file as**: `proview-cadence-logo.png`
2. **Location**: `/home/debjitdebbarman/Desktop/NICT Computer Services/images/`
3. **Path**: `images/proview-cadence-logo.png`

**Steps**:
```bash
# Navigate to images folder
cd "/home/debjitdebbarman/Desktop/NICT Computer Services/images/"

# Copy your logo file here
# Make sure it's named: proview-cadence-logo.png
```

### Option 2: Using Admin Panel

1. Go to: `http://localhost:8080/admin.html`
2. Login: admin / admin123
3. Click "Settings" in sidebar
4. Go to "Logo Settings" section
5. Click "Image Logo" tab
6. Upload your logo file
7. Click "Save Logo"
8. Click "Save All Changes"

### Current Configuration:

```json
{
  "logo": {
    "type": "image",
    "text": "ProView Cadence",
    "image": "images/proview-cadence-logo.png"
  }
}
```

### Logo Specifications:

- **Format**: PNG (recommended for transparency)
- **Max Width**: 350px
- **Height**: Auto-adjusted (60px max in navbar)
- **Quality**: High-resolution (will render crisp)
- **File Size**: Keep under 200KB for fast loading

### High-Quality Display:

The CSS is configured for:
✅ **Crisp rendering** - No blur
✅ **High quality** - Image optimization enabled  
✅ **Perfect fit** - Auto-scales to navbar
✅ **Responsive** - Adapts to all screen sizes

### Alternative: Use Data URL

If you want to embed the image directly in data.json:

1. Convert logo to base64:
```bash
base64 -w 0 your-logo.png
```

2. Update data.json:
```json
"image": "data:image/png;base64,iVBORw0KGgo..."
```

---

**Once you upload the logo file, refresh the website to see it!** 🎉
