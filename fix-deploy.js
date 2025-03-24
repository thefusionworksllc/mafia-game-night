const fs = require('fs');
const path = require('path');

// Create _redirects file for client-side routing
const createRedirects = () => {
  const redirectsContent = '/*    /index.html   200\n';
  const webBuildPath = path.join(__dirname, 'web-build');
  
  // Make sure the web-build directory exists
  if (!fs.existsSync(webBuildPath)) {
    console.error('web-build directory does not exist. Make sure to run build:web first.');
    return;
  }
  
  fs.writeFileSync(path.join(webBuildPath, '_redirects'), redirectsContent);
  console.log('Created _redirects file in web-build directory');
};

// Create .nojekyll to prevent GitHub Pages from using Jekyll
const createNojekyll = () => {
  const webBuildPath = path.join(__dirname, 'web-build');
  fs.writeFileSync(path.join(webBuildPath, '.nojekyll'), '');
  console.log('Created .nojekyll file in web-build directory');
};

// Ensure necessary files for PWA
const checkPwaFiles = () => {
  const webBuildPath = path.join(__dirname, 'web-build');
  const neededFiles = [
    'index.html', 
    'manifest.json', 
    'service-worker.js'
  ];

  for (const file of neededFiles) {
    const filePath = path.join(webBuildPath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`PWA file missing: ${file}. Your PWA may not work properly.`);
    }
  }

  // Check for assets directory and icons
  const assetsPath = path.join(webBuildPath, 'assets');
  if (!fs.existsSync(assetsPath)) {
    console.error('Assets directory is missing. Make sure icons are properly generated.');
    return;
  }

  console.log('PWA files verified successfully');
};

// Main function
const main = () => {
  console.log('Running fix-deploy script...');
  createRedirects();
  createNojekyll();
  checkPwaFiles();
  console.log('Fix-deploy script completed successfully!');
};

main(); 