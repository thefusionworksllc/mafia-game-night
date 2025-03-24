const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Generating PWA icons for different sizes...');

// Ensure web-build/assets directory exists
const webBuildAssetsDir = path.join(__dirname, '../web-build/assets');
if (!fs.existsSync(webBuildAssetsDir)) {
  fs.mkdirSync(webBuildAssetsDir, { recursive: true });
}

// Copy original icon to web-build/assets
const sourceIconPath = path.join(__dirname, '../assets/icon.png');
const destIconPath = path.join(webBuildAssetsDir, 'icon.png');
fs.copyFileSync(sourceIconPath, destIconPath);

// Copy icon to additional sizes since ImageMagick isn't available
const sizes = [152, 167, 180, 512];
sizes.forEach(size => {
  const outputPath = path.join(webBuildAssetsDir, `icon-${size}x${size}.png`);
  console.log(`Copying original icon to ${size}x${size} (resizing not available)...`);
  fs.copyFileSync(sourceIconPath, outputPath);
});

// Copy splash icon to web-build/assets
const sourceSplashPath = path.join(__dirname, '../assets/splash-icon.png');
if (fs.existsSync(sourceSplashPath)) {
  const destSplashPath = path.join(webBuildAssetsDir, 'splash-icon.png');
  fs.copyFileSync(sourceSplashPath, destSplashPath);
  console.log('Splash icon copied successfully.');
} else {
  console.log('Splash icon not found, using regular icon as splash.');
  fs.copyFileSync(sourceIconPath, path.join(webBuildAssetsDir, 'splash-icon.png'));
}

console.log('Icons copied successfully.');
console.log('PWA icon generation complete.'); 