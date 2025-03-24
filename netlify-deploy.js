/**
 * Fallback deployment script for Netlify
 * This script creates a minimal static website structure in case
 * the normal Expo export fails
 */

const fs = require('fs');
const path = require('path');

// Create the dist directory if it doesn't exist
function ensureDistDirectory() {
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
    console.log('Created dist directory');
  }
  return distPath;
}

// Create a minimal HTML file
function createHTML(distPath) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="#000000">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="manifest" href="/manifest.json">
  <title>Mafia Game Night</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #000000;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .container {
      padding: 20px;
      max-width: 800px;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Mafia Game Night</h1>
    <p>Loading the game... If this message persists, please refresh the page.</p>
    <div id="root"></div>
  </div>
  <script>
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
          .then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  </script>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(distPath, 'index.html'), htmlContent);
  console.log('Created index.html');
}

// Create a simple redirects file
function createRedirects(distPath) {
  fs.writeFileSync(path.join(distPath, '_redirects'), '/*    /index.html   200\n');
  console.log('Created _redirects file');
}

// Copy PWA files from public directory
function copyPWAFiles(distPath) {
  const publicDir = path.join(__dirname, 'public');
  const pwaFiles = ['manifest.json', 'service-worker.js', 'pwa.js'];
  
  // Create icons directory
  const iconsDir = path.join(distPath, 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  // Copy each PWA file
  pwaFiles.forEach(file => {
    const sourcePath = path.join(publicDir, file);
    const destPath = path.join(distPath, file);
    
    if (fs.existsSync(sourcePath)) {
      try {
        const content = fs.readFileSync(sourcePath);
        fs.writeFileSync(destPath, content);
        console.log(`Copied ${file}`);
      } catch (error) {
        console.error(`Error copying ${file}:`, error.message);
      }
    } else {
      console.warn(`Warning: ${file} not found in public directory`);
    }
  });
  
  // Copy icons if available
  const publicIconsDir = path.join(publicDir, 'icons');
  if (fs.existsSync(publicIconsDir)) {
    const iconFiles = fs.readdirSync(publicIconsDir);
    iconFiles.forEach(file => {
      const sourcePath = path.join(publicIconsDir, file);
      const destPath = path.join(iconsDir, file);
      
      if (fs.statSync(sourcePath).isFile()) {
        try {
          const content = fs.readFileSync(sourcePath);
          fs.writeFileSync(destPath, content);
          console.log(`Copied icon: ${file}`);
        } catch (error) {
          console.error(`Error copying icon ${file}:`, error.message);
        }
      }
    });
  } else {
    // Create fallback icons if needed
  }
}

// Main function
function main() {
  console.log('Running Netlify fallback deploy script...');
  
  try {
    const distPath = ensureDistDirectory();
    createHTML(distPath);
    createRedirects(distPath);
    copyPWAFiles(distPath);
    
    console.log('Fallback deploy script completed successfully!');
  } catch (error) {
    console.error('Error in fallback deploy script:', error);
    // Always ensure we have at least a minimal index.html
    try {
      const distPath = ensureDistDirectory();
      fs.writeFileSync(path.join(distPath, 'index.html'), '<html><body><h1>Mafia Game Night</h1><p>Loading...</p></body></html>');
    } catch (e) {
      console.error('Critical error creating minimal index.html:', e);
    }
  }
}

main(); 