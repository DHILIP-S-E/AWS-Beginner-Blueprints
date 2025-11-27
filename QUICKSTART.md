# Quick Start Guide

## Running the Project

The easiest way to run this project on Windows:

### Method 1: Python (if installed)

Open Command Prompt or PowerShell in the project folder and run:

```bash
python -m http.server 8000
```

Then open your browser to: **http://localhost:8000**

### Method 2: Node.js (if installed)

```bash
npx http-server -p 8000
```

Then open your browser to: **http://localhost:8000**

### Method 3: VS Code Live Server

1. Open the project folder in VS Code
2. Install the "Live Server" extension
3. Right-click on `index.html` and select "Open with Live Server"

## Troubleshooting

### Issue: "Failed to load application"

**Cause**: The browser is blocking local file access (file:// protocol)

**Solution**: You MUST run the project through a web server (see methods above). Simply opening index.html directly won't work because the browser blocks loading JSON files from the file system.

### Issue: Blank page or no services showing

**Check**:
1. Open browser console (F12)
2. Look for any error messages
3. Verify that `data/knowledge-base.json` exists
4. Make sure you're running through a web server, not opening the file directly

### Issue: Icons not showing

**Check**:
1. Verify that `assets/icons/` folder contains SVG files
2. Check browser console for 404 errors
3. Icons will gracefully hide if not found - this won't break functionality

## Testing the Application

1. **Test Search**: Type "serverless API" in the search box
2. **Test Trending Topics**: Click on any trending topic chip
3. **Test Service Browse**: Scroll down to see all services by category
4. **Test Service Details**: Click "Learn More" on any service card

## What Should Happen

When working correctly:
- ✅ Search box accepts input
- ✅ Trending topics are clickable
- ✅ Searching shows matching solution patterns
- ✅ Service cards display with icons and descriptions
- ✅ Architecture workflow diagram appears
- ✅ Cost guidance and security notes are shown
- ✅ Service index shows all AWS services grouped by category

## Browser Compatibility

Tested on:
- Chrome/Edge (recommended)
- Firefox
- Safari

Requires modern browser with ES6 support.
