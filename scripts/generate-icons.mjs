import { createCanvas } from 'canvas';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create icons directory if it doesn't exist
const iconsDir = join(__dirname, '../public/icons');
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes to generate
const sizes = [16, 32, 48, 128];

// Create each icon size
sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw a simple circular icon with the letter 'O'
  ctx.fillStyle = '#4F46E5'; // Indigo color
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Add white 'O' text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('O', size / 2, size / 2);
  
  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(join(iconsDir, `icon-${size}.png`), buffer);
  
  // Also create an active version with a different color
  ctx.fillStyle = '#10B981'; // Green color for active state
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Add white 'O' text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('O', size / 2, size / 2);
  
  // Save the active icon
  const activeBuffer = canvas.toBuffer('image/png');
  writeFileSync(join(iconsDir, `icon-active-${size}.png`), activeBuffer);
});

console.log('Icons generated successfully!');
