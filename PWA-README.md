# PWA Setup for Mafia Game Night

This project has been configured to work as a Progressive Web App (PWA), which allows users to install it on their mobile devices and experience it in full-screen mode.

## Features

- Full-screen mode on mobile devices
- Home screen installation
- Works offline (cached resources)
- Modern app-like experience

## How to Use

### Development

1. Run the development server:
   ```
   npm start
   ```

2. To specifically test the web version:
   ```
   npm run web
   ```

### Building for Production

1. Build the web version with PWA support:
   ```
   npm run build:web
   ```

   This will:
   - Export the Expo web build to the `web-build` directory
   - Copy the custom PWA files (index.html, manifest.json, service-worker.js)
   - Generate icons for the PWA

2. The output will be in the `web-build` directory

### Deployment

1. To deploy to GitHub Pages:
   ```
   npm run deploy
   ```

   This will:
   - Build the web version
   - Run the predeploy script that creates necessary files like `_redirects` and `.nojekyll`
   - Deploy to GitHub Pages

2. To deploy to Netlify:
   ```
   npm run deploy:netlify
   ```

   This will:
   - Build the web version with PWA support
   - Run the predeploy script that creates Netlify-specific files
   - Deploy directly to Netlify (requires Netlify CLI to be installed)

   Alternatively, you can connect your GitHub repository to Netlify and it will automatically deploy
   when you push changes to your repository.

## How to Use the PWA on Mobile Devices

### iOS (Safari)

1. Open the website in Safari
2. Tap the "Share" button (box with an arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top-right corner
5. The app will now appear on your home screen and launch in full-screen mode

### Android (Chrome)

1. Open the website in Chrome
2. Tap the menu button (three dots)
3. Select "Add to Home screen" or "Install app"
4. Follow the prompts to add the app to your home screen
5. The app will now appear on your home screen and launch in full-screen mode

## Troubleshooting

- If the app doesn't open in full-screen mode, make sure you're accessing it from the home screen icon, not directly through the browser.
- On iOS, the "Add to Home Screen" option may be hidden in the share menu - scroll down to find it.
- If you make changes to the PWA files, you need to rebuild using `npm run build:web`.

## Updating the PWA

When making updates to the app:

1. Make your changes to the codebase
2. Run `npm run build:web` to rebuild
3. Run `npm run deploy` to deploy the changes

The next time users open the app, they will receive the updated version. 