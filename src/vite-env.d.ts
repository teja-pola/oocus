/// <reference types="vite/client" />

// Global type declarations
declare const chrome: typeof chrome & {
  tabs: {
    query: (queryInfo: chrome.tabs.QueryInfo) => Promise<chrome.tabs.Tab[]>;
    sendMessage: <T = any>(
      tabId: number,
      message: any,
      options?: chrome.tabs.MessageSendOptions
    ) => Promise<T>;
    create: (createProperties: chrome.tabs.CreateProperties) => Promise<chrome.tabs.Tab>;
    onActivated: {
      addListener: (callback: (activeInfo: chrome.tabs.TabActiveInfo) => void) => void;
    };
  };
  storage: {
    sync: {
      get: (
        keys: string | string[] | object | null | undefined,
        callback: (items: { [key: string]: any }) => void
      ) => void;
      set: (items: object, callback?: () => void) => void;
    };
  };
  runtime: {
    onMessage: {
      addListener: (
        callback: (
          message: any,
          sender: chrome.runtime.MessageSender,
          sendResponse: (response?: any) => void
        ) => void | boolean
      ) => void;
    };
    onInstalled: {
      addListener: (callback: (details: chrome.runtime.InstalledDetails) => void) => void;
    };
    onStartup: {
      addListener: (callback: () => void) => void;
    };
    getURL: (path: string) => string;
  };
  commands: {
    onCommand: {
      addListener: (callback: (command: string) => void) => void;
    };
  };
  action: {
    setIcon: (details: { path: string | { [key: number]: string } }) => void;
  };
  scripting: {
    executeScript: (details: {
      target: { tabId: number };
      files?: string[];
      func?: () => void;
      args?: any[];
    }) => Promise<any[]>;
  };
};

// Add this to make the file a module
export {};
