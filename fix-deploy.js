const fs = require('fs');
const path = require('path');

/**
 * Simple script to copy the minimal PWA files to the build directory
 */
function fixDeploy() {
  console.log('Preparing minimal PWA files...');
  
  // Determine build output directory - Expo now builds to dist
  const buildDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(buildDir)) {
    console.error('Error: dist directory not found. Please run npx expo export -p web first.');
    process.exit(1);
  }
  
  // Ensure pwa directory exists in build output
  const pwaDirDist = path.join(buildDir, 'pwa');
  if (!fs.existsSync(pwaDirDist)) {
    console.log('Creating pwa directory in build output...');
    fs.mkdirSync(pwaDirDist, { recursive: true });
  }
  
  // Copy basic PWA files from public to build output
  const publicDir = path.join(__dirname, 'public');
  
  // Copy manifest file
  try {
    fs.copyFileSync(
      path.join(publicDir, 'manifest.json'),
      path.join(buildDir, 'manifest.json')
    );
    console.log('Manifest copied successfully.');
  } catch (error) {
    console.error('Error copying manifest:', error);
  }
  
  // Copy simple service worker
  try {
    fs.copyFileSync(
      path.join(publicDir, 'service-worker.js'),
      path.join(buildDir, 'service-worker.js')
    );
    console.log('Service worker copied successfully.');
  } catch (error) {
    console.error('Error copying service worker:', error);
  }
  
  // Copy PWA icons
  const pwaDirPublic = path.join(publicDir, 'pwa');
  if (fs.existsSync(pwaDirPublic)) {
    try {
      const files = fs.readdirSync(pwaDirPublic);
      files.forEach(file => {
        fs.copyFileSync(
          path.join(pwaDirPublic, file),
          path.join(pwaDirDist, file)
        );
      });
      console.log('PWA icons copied successfully.');
    } catch (error) {
      console.error('Error copying PWA icons:', error);
    }
  }
  
  // Create a simple HTML file for redirects if needed
  try {
    const redirectsContent = '<meta http-equiv="refresh" content="0;URL=\'/\'" />';
    fs.writeFileSync(path.join(buildDir, '404.html'), redirectsContent);
    console.log('Created 404.html for redirects');
  } catch (error) {
    console.error('Error creating 404.html:', error);
  }
  
  // Copy fonts.css
  try {
    fs.copyFileSync(
      path.join(publicDir, 'fonts.css'),
      path.join(buildDir, 'fonts.css')
    );
    console.log('Fonts CSS copied successfully.');
  } catch (error) {
    console.error('Error copying fonts CSS:', error);
  }
  
  console.log('Basic PWA setup complete.');
}

fixDeploy(); 