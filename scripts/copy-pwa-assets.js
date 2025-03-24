const fs = require('fs');
const path = require('path');

// Define source and destination directories
const sourceDir = path.join(__dirname, '../public');
const destDir = path.join(__dirname, '../dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('Created dist directory');
}

// Copy PWA files
function copyFile(source, dest) {
  try {
    const data = fs.readFileSync(source);
    fs.writeFileSync(dest, data);
    console.log(`Copied: ${path.basename(source)} to dist`);
  } catch (err) {
    console.error(`Error copying ${source}: ${err.message}`);
  }
}

// Copy specific files for PWA
const filesToCopy = [
  'manifest.json',
  'service-worker.js',
  'pwa.js',
];

// Copy each file
filesToCopy.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);
  
  if (fs.existsSync(sourcePath)) {
    copyFile(sourcePath, destPath);
  } else {
    console.error(`File does not exist: ${sourcePath}`);
  }
});

// Copy icons directory if it exists
const iconsSrcDir = path.join(sourceDir, 'icons');
const iconsDestDir = path.join(destDir, 'icons');

if (fs.existsSync(iconsSrcDir)) {
  if (!fs.existsSync(iconsDestDir)) {
    fs.mkdirSync(iconsDestDir, { recursive: true });
  }
  
  // Read all files in the icons directory
  const iconFiles = fs.readdirSync(iconsSrcDir);
  
  // Copy each icon file
  iconFiles.forEach(file => {
    const sourcePath = path.join(iconsSrcDir, file);
    const destPath = path.join(iconsDestDir, file);
    
    if (fs.statSync(sourcePath).isFile()) {
      copyFile(sourcePath, destPath);
    }
  });
  
  console.log('Copied icons directory to dist');
} else {
  console.error('Icons directory does not exist');
}

console.log('PWA assets copy complete!'); 