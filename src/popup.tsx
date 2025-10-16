import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/globals.css';
import '@/styles/popup.css';

// Define types for Chrome API
type ChromeTab = {
  id?: number;
  url?: string;
};

type StorageResult = {
  oocusActive?: boolean;
};

declare const chrome: any; // Declare chrome to avoid TypeScript errors

const Popup = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentHostname, setCurrentHostname] = useState<string>('this page');

  useEffect(() => {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: ChromeTab[]) => {
      try {
        if (tabs[0]?.url) {
          const url = new URL(tabs[0].url);
          setCurrentHostname(url.hostname);
        }
      } catch (e) {
        console.error('Error parsing URL:', e);
      }
      
      // Check if the extension is active for this tab
      chrome.storage.sync.get(['oocusActive'], (result: StorageResult) => {
        setIsActive(!!result.oocusActive);
      });
    });
  }, []);

  const toggleFocusMode = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);

    // Save the state to storage
    chrome.storage.sync.set({ oocusActive: newActiveState });

    // Send a message to the content script to toggle the focus mode
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: ChromeTab[]) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'TOGGLE_FOCUS_MODE', 
          isActive: newActiveState 
        }).catch((error: Error) => {
          console.error('Error sending message to content script:', error);
        });
      }
    });
  };

  return (
    <div className="premium-popup">
      <div className="card">
        <div className="card-decor">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
        </div>

        <header className="card-header">
          <div className="brand">
            <div className="logo-icon">o</div>
            <div className="brand-text">
              <div className="name">oocus</div>
              <div className="sub">stay focused</div>
            </div>
          </div>

          <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </header>

        <main className="card-body">
          <p className="description">
            {isActive
              ? 'Focus mode is active. Distracting content is now blurred.'
              : `Enable focus mode to blur distracting content on ${currentHostname}`}
          </p>

          <button
            onClick={toggleFocusMode}
            className={`action ${isActive ? 'active-btn' : 'primary-btn'}`}
            aria-pressed={isActive}
          >
            {isActive ? 'Disable Focus Mode' : 'Enable Focus Mode'}
          </button>
        </main>

        <footer className="card-footer">
          <div className="kbd-shortcut">Or press <kbd className="kbd">Alt</kbd> + <kbd className="kbd">O</kbd></div>
        </footer>
      </div>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  );
}
