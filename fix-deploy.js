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

// Check PWA files
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

// Create Netlify _headers file for cache control
const createHeaders = () => {
  const webBuildPath = path.join(__dirname, 'web-build');
  
  // Make sure the web-build directory exists
  if (!fs.existsSync(webBuildPath)) {
    console.error('web-build directory does not exist. Make sure to run build:web first.');
    return;
  }
  
  const headersContent = `# Headers for PWA
/manifest.json
  Cache-Control: max-age=0
  
/service-worker.js
  Cache-Control: max-age=0
  
/assets/*
  Cache-Control: public, max-age=31536000

/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
`;
  
  fs.writeFileSync(path.join(webBuildPath, '_headers'), headersContent);
  console.log('Created _headers file for Netlify with cache control');
};

// Create a netlify.toml file if it doesn't exist
const ensureNetlifyConfig = () => {
  const netlifyConfigPath = path.join(__dirname, 'netlify.toml');
  
  // Only create if it doesn't exist
  if (!fs.existsSync(netlifyConfigPath)) {
    const netlifyConfig = `[build]
  command = "npm run build:web"
  publish = "web-build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
    
    fs.writeFileSync(netlifyConfigPath, netlifyConfig);
    console.log('Created netlify.toml configuration file');
  } else {
    console.log('netlify.toml already exists. Skipping creation.');
  }
};

// Main function
const main = () => {
  console.log('Running fix-deploy script for Netlify...');
  createRedirects();
  checkPwaFiles();
  createHeaders();
  ensureNetlifyConfig();
  console.log('Fix-deploy script completed successfully!');
};

main(); 