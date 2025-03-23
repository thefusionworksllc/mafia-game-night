const fs = require('fs');
const path = require('path');

// Find the Expo script in the web-build directory
function findExpoScript() {
  try {
    const staticJsDir = path.join(__dirname, '../web-build/_expo/static/js/web');
    const files = fs.readdirSync(staticJsDir);
    
    // Find the main JS file
    for (const file of files) {
      if (file.startsWith('index-') && file.endsWith('.js')) {
        return `/_expo/static/js/web/${file}`;
      }
    }
    
    // If no specific file found, return the default path
    return '/_expo/static/js/web/index.js';
  } catch (error) {
    console.error('Error finding Expo script:', error.message);
    return '/_expo/static/js/web/index.js'; // Default fallback
  }
}

// Update the index.html with the correct script path
function updateIndexHtml() {
  const indexPath = path.join(__dirname, '../web-build/index.html');
  
  try {
    // Read the current index.html
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Find the correct Expo script path
    const scriptPath = findExpoScript();
    console.log(`Found Expo script at: ${scriptPath}`);
    
    // Replace the placeholder script path
    indexContent = indexContent.replace(
      /<script src=".*\/_expo\/static\/js\/web\/index.*\.js".*><\/script>/,
      `<script src="${scriptPath}" defer></script>`
    );
    
    // Write the updated content back
    fs.writeFileSync(indexPath, indexContent);
    console.log('Successfully updated index.html with correct Expo script path');
  } catch (error) {
    console.error('Error updating index.html:', error.message);
  }
}

// Run the update
console.log('Fixing index.html for Expo integration...');
updateIndexHtml(); 