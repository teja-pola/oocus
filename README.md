# oocus - Stay Focused

oocus is a browser extension that helps you stay focused by blurring distracting content on social media platforms. It allows you to focus on what's important by hiding distracting elements like thumbnails, posts, and videos, while keeping the navigation and search functionality accessible.

## Features

- Blurs distracting content on popular social media platforms
- Toggle focus mode with a single click or keyboard shortcut (Alt+O)
- Reveal hidden content temporarily when needed
- Works on YouTube, Facebook, Instagram, Twitter, and more
- Lightweight and non-intrusive

## Supported Platforms

- YouTube
- Facebook
- Instagram
- Twitter (X)

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Chrome, Firefox, or Edge browser

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/teja-pola/oocus.git
   cd oocus
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

### Loading the Extension in Your Browser

#### Chrome/Edge

1. Open your browser and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the `dist` directory

#### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on" and select any file in the `dist` directory

## Usage

1. Click the Oocus icon in your browser's toolbar to open the popup
2. Toggle the "Enable Focus Mode" button to blur distracting content
3. Use the "Reveal Content" button to temporarily show hidden content
4. Use the keyboard shortcut `Alt+O` to quickly toggle focus mode

## Building for Production

To create a production build of the extension:

```bash
npm run build
```

The built files will be available in the `dist` directory, ready for distribution.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
