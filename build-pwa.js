const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Helper script to build the PWA version of the app
 */
function buildPWA() {
  console.log('Building PWA version of Mafia Game Night...');
  
  try {
    // Step 1: Build the web version
    console.log('\n🏗️  Building web version...');
    execSync('npx expo export -p web', { stdio: 'inherit' });
    
    // Step 2: Copy PWA assets
    console.log('\n📦 Copying PWA assets...');
    require('./fix-deploy.js');
    
    // Step 3: Done!
    console.log('\n✅ PWA build complete!');
    console.log('\nTo test locally:');
    console.log('npx serve dist');
    console.log('\nTo deploy:');
    console.log('- Upload the dist directory to your web hosting service');
    console.log('- Ensure all files are served with the correct MIME types');
    console.log('- For best results, serve over HTTPS');
  } catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  }
}

buildPWA(); 