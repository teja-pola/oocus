const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, '../public');
const destDir = path.join(__dirname, '../dist');

// Ensure destination directory exists
fs.ensureDirSync(destDir);

// Copy all files from public to dist
try {
  fs.copySync(srcDir, destDir, { overwrite: true });
  console.log('Assets copied successfully!');
} catch (err) {
  console.error('Error copying assets:', err);
}
