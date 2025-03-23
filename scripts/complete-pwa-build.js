const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting complete PWA build process...');

// Step 1: Build the web app
console.log('\n📦 Step 1: Building web app...');
try {
  execSync('npx expo export -p web --output-dir web-build', { stdio: 'inherit' });
  console.log('✅ Web build completed successfully.');
} catch (error) {
  console.error('❌ Web build failed:', error);
  process.exit(1);
}

// Step 2: Copy custom PWA files
console.log('\n📂 Step 2: Copying PWA files...');
try {
  // Copy index.html (forced overwrite)
  const indexSrc = path.join(__dirname, '../web/index.html');
  const indexDest = path.join(__dirname, '../web-build/index.html');
  fs.copyFileSync(indexSrc, indexDest);
  console.log('✅ Copied index.html');
  
  // Copy manifest.json
  const manifestSrc = path.join(__dirname, '../web/manifest.json');
  const manifestDest = path.join(__dirname, '../web-build/manifest.json');
  fs.copyFileSync(manifestSrc, manifestDest);
  console.log('✅ Copied manifest.json');
  
  // Copy service-worker.js
  const swSrc = path.join(__dirname, '../web/service-worker.js');
  const swDest = path.join(__dirname, '../web-build/service-worker.js');
  fs.copyFileSync(swSrc, swDest);
  console.log('✅ Copied service-worker.js');
} catch (error) {
  console.error('❌ Failed to copy PWA files:', error);
  process.exit(1);
}

// Step 3: Generate PWA icons
console.log('\n🖼️ Step 3: Generating PWA icons...');
try {
  execSync('node scripts/generate-pwa-icons.js', { stdio: 'inherit' });
  console.log('✅ PWA icons generated successfully.');
} catch (error) {
  console.error('❌ Failed to generate PWA icons:', error);
  process.exit(1);
}

// Step 4: Fix index.html with correct script path
console.log('\n🔧 Step 4: Fixing index.html script path...');
try {
  execSync('node scripts/fix-index-html.js', { stdio: 'inherit' });
  console.log('✅ Index.html fixed successfully.');
} catch (error) {
  console.error('❌ Failed to fix index.html:', error);
  process.exit(1);
}

// Step 5: Generate Netlify deployment files
console.log('\n🌐 Step 5: Creating Netlify deployment files...');
try {
  execSync('node fix-deploy.js', { stdio: 'inherit' });
  console.log('✅ Netlify deployment files created successfully.');
} catch (error) {
  console.error('❌ Failed to create Netlify deployment files:', error);
  process.exit(1);
}

// Step 6: Verify PWA setup
console.log('\n✅ Step 6: Verifying PWA setup...');
try {
  execSync('node scripts/check-pwa.js', { stdio: 'inherit' });
  console.log('✅ PWA verification completed.');
} catch (error) {
  console.error('❌ PWA verification had issues:', error);
}

console.log('\n🎉 Complete PWA build process finished successfully!');
console.log('Your app is ready to be deployed. Use "netlify deploy --prod" to deploy to Netlify.');
console.log('After deployment, access your site on iOS Safari and add it to the home screen to enjoy full-screen mode.'); 