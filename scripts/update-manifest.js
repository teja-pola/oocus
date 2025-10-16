const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '../dist/manifest.json');

// Read the manifest file
fs.readFile(manifestPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading manifest:', err);
    process.exit(1);
  }

  try {
    const manifest = JSON.parse(data);
    
    // Update paths
    manifest.background.service_worker = 'assets/background.js';
    manifest.content_scripts[0].js = ['assets/content.js'];
    
    // Update icon paths to match the actual filenames
    manifest.action.default_icon = {
      '16': 'icons/icon-16.png',
      '32': 'icons/icon-32.png',
      '48': 'icons/icon-48.png',
      '128': 'icons/icon-128.png'
    };
    
    // Write the updated manifest back to disk
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Manifest updated successfully');
  } catch (error) {
    console.error('Error updating manifest:', error);
    process.exit(1);
  }
});
