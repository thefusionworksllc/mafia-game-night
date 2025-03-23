const fs = require('fs');
const path = require('path');

console.log('Checking PWA configuration for common issues...\n');

// Function to check if a file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// Check web-build directory
const webBuildPath = path.join(__dirname, '../web-build');
if (!fileExists(webBuildPath)) {
  console.error('❌ web-build directory not found. Run "npm run build:web" first.');
  process.exit(1);
}

// Check for index.html
const indexPath = path.join(webBuildPath, 'index.html');
if (!fileExists(indexPath)) {
  console.error('❌ index.html not found in web-build directory.');
  process.exit(1);
}

// Check index.html content
const indexHtml = fs.readFileSync(indexPath, 'utf8');
console.log('Checking index.html for required PWA meta tags...');

const requiredMetaTags = [
  'apple-mobile-web-app-capable',
  'apple-touch-fullscreen',
  'apple-mobile-web-app-status-bar-style',
  'mobile-web-app-capable',
  'theme-color'
];

const missingTags = [];
requiredMetaTags.forEach(tag => {
  if (!indexHtml.includes(`name="${tag}"`)) {
    missingTags.push(tag);
  }
});

if (missingTags.length > 0) {
  console.error(`❌ Missing required meta tags: ${missingTags.join(', ')}`);
} else {
  console.log('✅ All required meta tags found in index.html');
}

// Check for manifest.json
const manifestPath = path.join(webBuildPath, 'manifest.json');
if (!fileExists(manifestPath)) {
  console.error('❌ manifest.json not found in web-build directory.');
} else {
  console.log('✅ manifest.json found');
  
  // Check manifest content
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('\nChecking manifest.json properties...');
    
    const requiredProps = ['name', 'short_name', 'start_url', 'display', 'background_color', 'theme_color', 'icons'];
    const missingProps = [];
    
    requiredProps.forEach(prop => {
      if (!manifest[prop]) {
        missingProps.push(prop);
      }
    });
    
    if (missingProps.length > 0) {
      console.error(`❌ Missing required manifest properties: ${missingProps.join(', ')}`);
    } else {
      console.log('✅ All required manifest properties found');
    }
    
    // Check icons
    if (manifest.icons && Array.isArray(manifest.icons)) {
      if (manifest.icons.length === 0) {
        console.error('❌ No icons defined in manifest.json');
      } else {
        console.log(`✅ Found ${manifest.icons.length} icons in manifest`);
        
        // Check if icons exist
        console.log('\nChecking icon files...');
        const missingIcons = [];
        
        manifest.icons.forEach(icon => {
          const iconPath = path.join(webBuildPath, icon.src.replace(/^\.\//, ''));
          if (!fileExists(iconPath)) {
            missingIcons.push(icon.src);
          }
        });
        
        if (missingIcons.length > 0) {
          console.error(`❌ Missing icon files: ${missingIcons.join(', ')}`);
        } else {
          console.log('✅ All icon files exist');
        }
      }
    } else {
      console.error('❌ No icons array in manifest.json');
    }
    
    // Check start_url
    if (manifest.start_url && manifest.start_url.startsWith('/')) {
      console.warn('⚠️ start_url starts with "/" which may cause issues. Consider using "./" instead.');
    }
  } catch (err) {
    console.error('❌ Error parsing manifest.json:', err.message);
  }
}

// Check for service-worker.js
const swPath = path.join(webBuildPath, 'service-worker.js');
if (!fileExists(swPath)) {
  console.error('❌ service-worker.js not found in web-build directory.');
} else {
  console.log('✅ service-worker.js found');
  
  // Check service worker content
  const sw = fs.readFileSync(swPath, 'utf8');
  
  if (!sw.includes('self.addEventListener(\'install\'')) {
    console.error('❌ service-worker.js missing install event listener');
  }
  
  if (!sw.includes('self.addEventListener(\'fetch\'')) {
    console.error('❌ service-worker.js missing fetch event listener');
  }
  
  if (!sw.includes('self.addEventListener(\'activate\'')) {
    console.error('❌ service-worker.js missing activate event listener');
  }
  
  if (sw.includes('\'/')) {
    console.warn('⚠️ service-worker.js contains absolute paths which may cause issues. Consider using relative paths.');
  }
}

// Check for _redirects
const redirectsPath = path.join(webBuildPath, '_redirects');
if (!fileExists(redirectsPath)) {
  console.error('❌ _redirects not found in web-build directory. Run "npm run predeploy".');
} else {
  console.log('✅ _redirects file found');
}

// Check for _headers
const headersPath = path.join(webBuildPath, '_headers');
if (!fileExists(headersPath)) {
  console.error('❌ _headers not found in web-build directory. Run "npm run predeploy".');
} else {
  console.log('✅ _headers file found');
}

console.log('\nPWA check complete. Address any issues above for better PWA compatibility.');
console.log('After deploying, visit your site on iOS and add it to your home screen to test full-screen mode.'); 