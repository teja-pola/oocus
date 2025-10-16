import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir, copyFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = join(__dirname, '../public');
const destDir = join(__dirname, '../dist');

async function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!existsSync(dest)) {
    await mkdir(dest, { recursive: true });
  }

  // Read the source directory
  const entries = await readdir(src, { withFileTypes: true });

  // Process each entry
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      await copyDir(srcPath, destPath);
    } else {
      // Copy files
      await copyFile(srcPath, destPath);
    }
  }
}

// Main function
async function main() {
  try {
    if (!existsSync(srcDir)) {
      console.log('Source directory does not exist, nothing to copy');
      return;
    }
    
    console.log('Copying assets...');
    await copyDir(srcDir, destDir);
    console.log('Assets copied successfully!');
  } catch (err) {
    console.error('Error copying assets:', err);
    process.exit(1);
  }
}

// Run the main function
main();
