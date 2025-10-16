// Background script for Oocus extension

// Toggle focus mode for the current tab
const toggleFocusMode = async (): Promise<void> => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    
    if (!tab?.id) return;
    
    // Get current state
    const result = await new Promise<{ oocusActive?: boolean }>((resolve) => {
      chrome.storage.sync.get(['oocusActive'], (items) => {
        resolve(items as { oocusActive?: boolean });
      });
    });
    
    const newState = !result.oocusActive;
    
    // Save new state
    await new Promise<void>((resolve) => {
      chrome.storage.sync.set({ oocusActive: newState }, () => resolve());
    });
    
    // Update the icon
    updateIcon(newState);
    
    // Send message to content script
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'TOGGLE_FOCUS_MODE',
        isActive: newState
      });
    } catch (error) {
      // If the content script isn't loaded yet, inject it
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['assets/content.js']
        });
        
        // Now that the content script is loaded, send the message
        await chrome.tabs.sendMessage(tab.id, {
          action: 'TOGGLE_FOCUS_MODE',
          isActive: newState
        });
      } catch (injectError) {
        console.error('Failed to inject content script:', injectError);
      }
    }
  } catch (error) {
    console.error('Error in toggleFocusMode:', error);
  }
};

// Update the extension icon based on the active state
const updateIcon = (isActive: boolean): void => {
  const iconSizes = [16, 32, 48, 128];
  const iconPath = isActive ? 'icon-active' : 'icon';
  
  const iconPaths = {} as Record<number, string>;
  
  iconSizes.forEach(size => {
    iconPaths[size] = `icons/${iconPath}-${size}.png`;
  });
  
  chrome.action.setIcon({ path: iconPaths });
};

// Set up keyboard shortcut (Alt+O) to toggle focus mode
chrome.commands.onCommand.addListener((command: string) => {
  if (command === 'toggle-focus-mode') {
    toggleFocusMode().catch((error) => {
      console.error('Error in command handler:', error);
    });
  }
});

// Listen for tab updates to update the icon state
chrome.tabs.onActivated.addListener(() => {
  chrome.storage.sync.get(['oocusActive'], (result: { oocusActive?: boolean }) => {
    updateIcon(!!result.oocusActive);
  });
});

// Initialize the extension icon state
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(['oocusActive'], (result: { oocusActive?: boolean }) => {
    updateIcon(!!result.oocusActive);
  });
});

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default state on installation
    chrome.storage.sync.set({ oocusActive: false }, () => {
      // Open the options page after installation
      chrome.tabs.create({
        url: chrome.runtime.getURL('popup.html')
      }).catch(console.error);
    });
  }
  
  // Set initial icon state
  chrome.storage.sync.get(['oocusActive'], (result: { oocusActive?: boolean }) => {
    updateIcon(!!result.oocusActive);
  });
});
