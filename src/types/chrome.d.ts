// Type definitions for Chrome extension API
declare namespace chrome {
  namespace runtime {
    interface Port {
      postMessage: (message: any) => void;
      disconnect: () => void;
      onMessage: any;
      onDisconnect: any;
    }

    interface MessageSender {
      tab?: chrome.tabs.Tab;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
    }

    interface InstalledDetails {
      id?: string;
      previousVersion?: string;
      reason: 'install' | 'update' | 'chrome_update' | 'shared_module_update';
    }

    const onInstalled: {
      addListener: (callback: (details: InstalledDetails) => void) => void;
      removeListener: (callback: (details: InstalledDetails) => void) => void;
    };

    const onStartup: {
      addListener: (callback: () => void) => void;
    };

    const onMessage: {
      addListener: (
        callback: (
          message: any,
          sender: MessageSender,
          sendResponse: (response?: any) => void
        ) => void
      ) => void;
    };

    function getURL(path: string): string;
  }

  namespace storage {
    interface StorageArea {
      get: (keys: string | string[] | object, callback: (items: { [key: string]: any }) => void) => void;
      set: (items: object, callback?: () => void) => void;
      remove: (keys: string | string[], callback?: () => void) => void;
      clear: (callback?: () => void) => void;
    }

    const sync: StorageArea;
    const local: StorageArea;
  }

  namespace tabs {
    interface Tab {
      id?: number;
      index: number;
      windowId?: number;
      openerTabId?: number;
      selected: boolean;
      highlighted: boolean;
      active: boolean;
      pinned: boolean;
      url?: string;
      title?: string;
      favIconUrl?: string;
      status?: string;
      incognito: boolean;
      width?: number;
      height?: number;
      sessionId?: string;
    }

    interface CreateProperties {
      active?: boolean;
      index?: number;
      url?: string;
      selected?: boolean;
      windowId?: number;
    }

    interface QueryInfo {
      active?: boolean;
      currentWindow?: boolean;
      windowId?: number;
      windowType?: string;
      index?: number;
    }

    interface TabActiveInfo {
      tabId: number;
      windowId: number;
    }

    function query(queryInfo: QueryInfo, callback: (result: Tab[]) => void): void;
    function create(createProperties: CreateProperties, callback?: (tab: Tab) => void): void;
    function update(tabId: number, updateProperties: object, callback?: (tab?: Tab) => void): void;
    function sendMessage(tabId: number, message: any, responseCallback?: (response: any) => void): void;
    
    const onActivated: {
      addListener: (callback: (activeInfo: TabActiveInfo) => void) => void;
    };
  }

  namespace commands {
    interface Command {
      name?: string;
      description?: string;
      shortcut?: string;
    }

    const onCommand: {
      addListener: (callback: (command: string) => void) => void;
    };
  }

  namespace action {
    function setIcon(details: { path: string | { [key: number]: string } }): void;
  }

  namespace scripting {
    interface InjectionTarget {
      tabId: number;
      allFrames?: boolean;
    }

    function executeScript(
      details: { target: InjectionTarget; files?: string[]; func?: () => void; args?: any[] }
    ): Promise<any>;
  }
}

// Declare the global chrome object
declare const chrome: typeof chrome;
