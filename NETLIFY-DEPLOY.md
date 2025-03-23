# Deploying to Netlify

This guide will help you deploy the Mafia Game Night PWA to Netlify.

## Option 1: Using Netlify CLI (Command Line)

1. Install the Netlify CLI if you haven't already:
   ```
   npm install -g netlify-cli
   ```

2. Log in to Netlify:
   ```
   netlify login
   ```

3. Build and deploy:
   ```
   npm run deploy:netlify
   ```

   This script will:
   - Build the app with PWA support
   - Create necessary Netlify configuration files
   - Deploy directly to your Netlify account

## Option 2: Using Netlify UI (Continuous Deployment)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Log in to [Netlify](https://app.netlify.com/)

3. Click "New site from Git"

4. Select your Git provider and repository

5. Configure build settings:
   - Build command: `npm run build:web`
   - Publish directory: `web-build`

6. Click "Deploy site"

7. Your site will be deployed automatically whenever you push changes to your repository

## Checking Your Deployment

After deploying, you can verify that your PWA works correctly:

1. Visit your Netlify site URL
2. Open browser developer tools
3. Go to the "Application" tab (in Chrome)
4. Check that the manifest and service worker are properly registered
5. Try installing the app to your home screen

## PWA Features

Your Netlify deployment includes:

- Full-screen mode on mobile devices
- Home screen installation
- Offline capabilities through service worker caching
- Fast loading times with optimized assets

## Troubleshooting

- If your deployment fails, check the Netlify build logs for errors
- If your PWA isn't working correctly, make sure the service worker and manifest are being served with the correct content types
- If you need to update PWA assets, run `npm run build:web` again to regenerate them 