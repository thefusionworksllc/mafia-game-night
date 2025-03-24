const fs = require('fs');
const path = require('path');

// Create _redirects file for client-side routing
const createRedirects = () => {
  const redirectsContent = '/*    /index.html   200\n';
  const distPath = path.join(__dirname, 'dist');
  
  // Make sure the dist directory exists
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }
  
  fs.writeFileSync(path.join(distPath, '_redirects'), redirectsContent);
  console.log('Created _redirects file in dist directory');
};

// Ensure web-build directory points to dist for Netlify
const setupWebBuild = () => {
  const webBuildPath = path.join(__dirname, 'web-build');
  
  // Create or clear the web-build directory
  if (!fs.existsSync(webBuildPath)) {
    fs.mkdirSync(webBuildPath, { recursive: true });
  } else {
    // Clear any existing files
    const files = fs.readdirSync(webBuildPath);
    for (const file of files) {
      fs.unlinkSync(path.join(webBuildPath, file));
    }
  }
  
  // Create a README.md file in web-build explaining that the actual build is in dist
  const readmeContent = `# Web Build Directory\n\nThis directory exists for compatibility with Netlify deployments.\nThe actual build output is in the 'dist' directory.\n\nPlease update your Netlify settings to use 'dist' as the publish directory.\n`;
  fs.writeFileSync(path.join(webBuildPath, 'README.md'), readmeContent);
  console.log('Created README.md in web-build directory');
};

// Copy PWA assets to dist directory
const copyPwaAssets = () => {
  console.log('Copying PWA assets to dist directory...');
  
  const sourceDir = path.join(__dirname, 'public');
  const distDir = path.join(__dirname, 'dist');
  
  // Create dist directory if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Function to copy a file
  const copyFile = (source, dest) => {
    try {
      const data = fs.readFileSync(source);
      fs.writeFileSync(dest, data);
      console.log(`Copied: ${path.basename(source)} to dist`);
    } catch (err) {
      console.error(`Error copying ${source}: ${err.message}`);
    }
  };
  
  // List of specific PWA files to copy
  const pwaFiles = [
    'manifest.json',
    'service-worker.js',
    'pwa.js',
    '_redirects'
  ];
  
  // Copy each PWA file
  pwaFiles.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(sourcePath)) {
      copyFile(sourcePath, destPath);
    } else {
      console.warn(`Warning: PWA file not found: ${sourcePath}`);
    }
  });
  
  // Copy icons directory
  const iconsSrcDir = path.join(sourceDir, 'icons');
  const iconsDestDir = path.join(distDir, 'icons');
  
  if (fs.existsSync(iconsSrcDir)) {
    // Create icons directory in dist
    if (!fs.existsSync(iconsDestDir)) {
      fs.mkdirSync(iconsDestDir, { recursive: true });
    }
    
    // Copy each icon
    const iconFiles = fs.readdirSync(iconsSrcDir);
    iconFiles.forEach(file => {
      const srcPath = path.join(iconsSrcDir, file);
      const destPath = path.join(iconsDestDir, file);
      
      if (fs.statSync(srcPath).isFile()) {
        copyFile(srcPath, destPath);
      }
    });
    
    console.log('Copied icons directory to dist');
  } else {
    console.warn('Warning: Icons directory not found');
  }
};

// Main function
const main = () => {
  console.log('Running fix-deploy script...');
  createRedirects();
  setupWebBuild();
  copyPwaAssets();
  console.log('Fix-deploy script completed successfully!');
};

main(); 