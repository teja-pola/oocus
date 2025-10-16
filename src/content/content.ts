// Content script that runs on the web page
let isActive = false;
let isRevealed = false;
let overlay: HTMLElement | null = null;
let revealButton: HTMLButtonElement | null = null;
let styleElement: HTMLStyleElement | null = null;
let observer: MutationObserver | null = null;

// Get the main content element based on the current website
const getContentElement = (): HTMLElement | null => {
  const { hostname } = window.location;
  
  if (hostname.includes('youtube.com')) {
    return document.querySelector('#primary') || 
           document.querySelector('#page-manager') || 
           document.body;
  }
  else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    return document.querySelector('[data-testid="primaryColumn"]') || 
           document.body;
  }
  else if (hostname.includes('instagram.com')) {
    return document.querySelector('main') || document.body;
  }
  else if (hostname.includes('facebook.com')) {
    return document.querySelector('[role="main"]') || document.body;
  }
  return document.body;
};

// Create and position the overlay and button
const createOverlay = (): void => {
  if (overlay) return;
  
  console.log('Creating overlay elements...');
  
  // Create and append styles
  styleElement = document.createElement('style');
  styleElement.textContent = `
    .oocus-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px) saturate(180%);
      -webkit-backdrop-filter: blur(12px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      z-index: 10000;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
    }
    
    .oocus-reveal-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 14px 28px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 16px;
      cursor: pointer;
      z-index: 10001;
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .oocus-reveal-button:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }
    
    .oocus-reveal-button:active {
      transform: translateY(0);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
    }
    
    /* Ensure overlay stays on top of content but below the button */
    body > *:not(.oocus-overlay):not(.oocus-reveal-button) {
      position: relative;
      z-index: 1;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Create overlay
  overlay = document.createElement('div');
  overlay.className = 'oocus-overlay';
  overlay.style.display = 'none';
  
  // Create reveal button with glass morphism effect
  revealButton = document.createElement('button');
  revealButton.className = 'oocus-reveal-button';
  revealButton.textContent = 'Reveal Content';
  revealButton.style.display = 'none';
  
  // Add elements to the content area, not the body directly
  const contentElement = getContentElement() || document.body;
  contentElement.appendChild(overlay);
  document.body.appendChild(revealButton);
  
  // Add event listeners
  setupEventListeners();
  
  console.log('Overlay elements created');
};

// Position the overlay over the content area
const positionOverlay = (): void => {
  if (!overlay) return;
  
  const contentElement = getContentElement() || document.body;
  const rect = contentElement.getBoundingClientRect();
  
  // Position overlay over the content area
  overlay.style.position = 'absolute';
  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
};

// Setup event listeners
const setupEventListeners = (): void => {
  if (!revealButton) return;
  
  // Toggle reveal state on button click
  revealButton.addEventListener('click', (e) => {
    e.stopPropagation();
    isRevealed = !isRevealed;
    
    if (overlay) {
      overlay.style.opacity = isRevealed ? '0' : '1';
      overlay.style.backdropFilter = isRevealed ? 'none' : 'blur(12px) saturate(180%)';
      overlay.style.pointerEvents = isRevealed ? 'none' : 'auto';
    }
    
    if (revealButton) {
      revealButton.textContent = isRevealed ? 'Blur Content' : 'Reveal Content';
      // Update button glass effect based on state
      revealButton.style.background = isRevealed 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(255, 255, 255, 0.25)';
    }
  });
  
  // Hide content when clicking outside
  document.addEventListener('click', (e) => {
    if (isRevealed && e.target !== revealButton && !revealButton?.contains(e.target as Node)) {
      isRevealed = false;
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.backdropFilter = 'blur(12px) saturate(180%)';
        overlay.style.pointerEvents = 'auto';
      }
      if (revealButton) {
        revealButton.textContent = 'Reveal Content';
        revealButton.style.background = 'rgba(255, 255, 255, 0.15)';
      }
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (isActive) {
      positionOverlay();
    }
  });
  
  // Handle scroll
  window.addEventListener('scroll', () => {
    if (isActive && !isRevealed) {
      positionOverlay();
    }
  }, { passive: true });
};

// Toggle the focus mode
const setFocusMode = (active: boolean): void => {
  console.log(`Setting focus mode to: ${active}`);
  isActive = active;
  
  if (!overlay || !revealButton) {
    console.log('Creating overlay elements...');
    createOverlay();
  }
  
  if (isActive) {
    // Position and show overlay
    positionOverlay();
    if (overlay) {
      overlay.style.display = 'block';
      overlay.style.opacity = '1';
      overlay.style.backdropFilter = 'blur(12px) saturate(180%)';
    }
    if (revealButton) {
      revealButton.style.display = 'flex';
      revealButton.style.background = 'rgba(255, 255, 255, 0.15)';
    }
    isRevealed = false;
    
    // Setup mutation observer for dynamic content
    if (!observer) {
      observer = new MutationObserver(() => {
        if (isActive) {
          positionOverlay();
        }
      });
      
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }
  } else {
    // Hide everything
    if (overlay) overlay.style.display = 'none';
    if (revealButton) revealButton.style.display = 'none';
    isRevealed = false;
    
    // Clean up observer
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }
};

// Initialize the extension
const init = (): void => {
  console.log('Oocus content script initialized on:', window.location.href);
  
  // Listen for messages from the popup or background script
  chrome.runtime.onMessage.addListener((
    request: { action: string; isActive?: boolean },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    console.log('Message received:', request);
    if (request.action === 'TOGGLE_FOCUS_MODE' && typeof request.isActive === 'boolean') {
      setFocusMode(request.isActive);
    }
    sendResponse({ status: 'success' });
    return true;
  });

  // Check if the extension is active when the page loads
  chrome.storage.sync.get(['oocusActive'], (result: { oocusActive?: boolean }) => {
    console.log('Storage get result:', result);
    if (result.oocusActive) {
      console.log('Initial state: active');
      // Small delay to ensure the page is fully loaded
      setTimeout(() => setFocusMode(true), 300);
    } else {
      console.log('Initial state: inactive');
    }
  });
};

// Run initialization when the DOM is fully loaded
if (document.readyState === 'loading') {
  console.log('Document is still loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', init);
} else {
  console.log('Document already loaded, initializing immediately');
  init();
}

console.log('Oocus content script loaded');

// Re-check after a delay to handle dynamic content loading
setTimeout(() => {
  chrome.storage.sync.get(['oocusActive'], (result: { oocusActive?: boolean }) => {
    if (result.oocusActive) {
      console.log('Delayed activation check: active');
      setFocusMode(true);
    }
  });
}, 2000);
