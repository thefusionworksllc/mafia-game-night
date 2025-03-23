# Quick Deployment Guide for Mafia Game Night PWA

## Building and Deploying to Netlify

1. **Build the PWA with full-screen support**:
   ```
   npm run build:web
   ```
   This command runs our comprehensive build process which:
   - Builds the web app
   - Adds PWA support
   - Generates icons
   - Creates Netlify configuration files
   - Verifies the PWA setup

2. **Deploy to Netlify**:
   ```
   netlify deploy --prod
   ```
   This will deploy the app to your Netlify account.

   If you haven't logged in yet, run:
   ```
   netlify login
   ```
   first.

## Testing Full-Screen Mode on iOS

1. Visit your Netlify URL in Safari on your iOS device
2. Tap the "Share" button (box with an arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top-right corner
5. The app will now appear on your home screen
6. Launch the app from the home screen icon

When launched from the home screen, the app will run in full-screen mode without the Safari browser controls.

## Troubleshooting

If full-screen mode isn't working:

1. Make sure you're launching from the home screen icon
2. Check that you've completed the "Add to Home Screen" process
3. Ensure you've deployed the latest version with `npm run build:web`
4. Clear your browser cache or try in private browsing mode
5. Make sure you're using the latest Safari version 