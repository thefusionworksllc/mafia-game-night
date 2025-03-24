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
// Main function
const main = () => {
  console.log('Running fix-deploy script...');
  createRedirects();
  setupWebBuild();
  copyPwaAssets();
  console.log('Fix-deploy script completed successfully!');
};

main(); 