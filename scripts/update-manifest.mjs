import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const manifestPath = join(__dirname, '../dist/manifest.json');

try {
  // Read the manifest file
  const data = await readFile(manifestPath, 'utf8');
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
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Manifest updated successfully');
} catch (error) {
  console.error('Error updating manifest:', error);
  process.exit(1);
}
