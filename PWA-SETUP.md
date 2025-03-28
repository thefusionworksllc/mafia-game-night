# Mafia Game Night PWA Setup

This document explains how to build and deploy the Mafia Game Night app as a Progressive Web App (PWA) with basic features.

## Features Implemented

The PWA version includes:

1. **Fullscreen experience** - App runs without browser UI when installed
2. **Home screen icon and splash screen** - App can be installed on home screens
3. **Simple PWA functionality** - Just the basics without offline support

## Building the PWA

To build the PWA version, run:

```bash
npm run build:pwa
```

This will:
1. Build the web version of the app
2. Copy PWA assets (manifest, service worker, icons)
3. Generate the final output in the `dist` directory

## Testing Locally

To test the PWA locally, run:

```bash
npm run serve:pwa
```

This will start a local server at http://localhost:3000

To test the PWA installation:
1. Open Chrome or Safari
2. Navigate to the local server URL
3. In Chrome, look for the install icon in the address bar
4. In Safari, tap the share button and select "Add to Home Screen"

## Deployment

To deploy the PWA:

1. Upload the contents of the `dist` directory to your web hosting service
2. Ensure all files are served with the correct MIME types
3. For best results, serve over HTTPS (required for some PWA features)

## File Structure

- `public/manifest.json` - Defines app metadata for PWA
- `public/service-worker.js` - Minimal service worker for PWA support
- `public/index.html` - HTML template with PWA meta tags
- `public/pwa/` - Directory containing PWA icons

## Important Notes

- This implementation focuses on the basic PWA features only
- No offline functionality is implemented
- No advanced caching or background sync
- User must manually add to home screen (no custom install UI) 