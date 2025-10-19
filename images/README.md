# Images Folder

This folder stores uploaded images for:
- `/projects/` - Project images
- `/gallery/` - Gallery photos

## Usage

When you upload images through the admin panel, they will be stored here.

You can also manually add images to these folders and reference them in your data.json file.

## Image Guidelines

- **Format:** JPG, PNG, WebP
- **Size:** Recommended max 2MB per image
- **Dimensions:** 
  - Projects: 800x600px or 1200x900px
  - Gallery: 800x600px or higher
- **Naming:** Use descriptive names without spaces (use hyphens or underscores)

## Example

```json
{
  "image": "images/projects/my-project.jpg"
}
```

Or use external URLs:
```json
{
  "image": "https://example.com/image.jpg"
}
```
