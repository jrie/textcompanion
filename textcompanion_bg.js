// --------------------------------------------------------------------
const useChrome = typeof (browser) === 'undefined';
const localData = {
  tc__translateButton: true,
  tc__openLinkButton: true,
  tc__wiktionaryButton: true,
  tc__geizhalsButton: true,
  tc__googleSelectionButton: true,
  tc__openTextLinkButton: true,
  tc__translateLanguage: 'en',
  tc__useOverlay: true,
  tc__overlayKey: false,
  tc__translateMenu: true,
  tc__openLinkMenu: true,
  tc__openTextLinkMenu: true,
  tc__wiktionaryMenu: true,
  tc__geizhalsMenu: true,
  tc__googleSelectionMenu: true
};

// --------------------------------------------------------------------
function handleMessages (message) {
  if (useChrome) {
    chrome.storage.local.get().then(loadValues, onLoadError);
  } else {
    browser.storage.local.get().then(loadValues, onLoadError);
  }

  if (message.status !== undefined) {
    if (!message.status.hasLinks) {
      if (useChrome) {
        chrome.contextMenus.update('linksBackground', { enabled: false });
      } else {
        browser.contextMenus.update('linksBackground', { enabled: false });
      }
    } else {
      if (useChrome) {
        chrome.contextMenus.update('linksBackground', { enabled: true });
      } else {
        browser.contextMenus.update('linksBackground', { enabled: true });
      }
    }

    if (!message.status.hasTextLinks) {
      if (useChrome) {
        chrome.contextMenus.update('textLinksBackground', { enabled: false });
      } else {
        browser.contextMenus.update('textLinksBackground', { enabled: false });
      }
    } else {
      if (useChrome) {
        chrome.contextMenus.update('textLinksBackground', { enabled: true });
      } else {
        browser.contextMenus.update('textLinksBackground', { enabled: true });
      }
    }

    return;
  }

  function openTabLinks (currentTab) {
    let index = -1;
    if (currentTab !== undefined) {
      index = currentTab.pop().index;
    }

    if (message.links !== undefined) {
      if (useChrome) {
        for (const linkUrl of message.links) {
          chrome.tabs.create({ active: false, url: linkUrl, index: ++index });
        }
      } else {
        for (const linkUrl of message.links) {
          browser.tabs.create({ active: false, url: linkUrl, index: ++index });
        }
      }
    }
  }

  if (useChrome) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, openTabLinks);
  } else {
    browser.tabs.query({ active: true, lastFocusedWindow: true }, openTabLinks);
  }
}

// --------------------------------------------------------------------

function sendMessageToTab (info) {
  if (useChrome) {
    if (info.menuItemId === 'settings') {
      chrome.runtime.openOptionsPage();
      return true;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { component: info.menuItemId });
      return true;
    });

    return false;
  }

  if (info.menuItemId === 'settings') {
    browser.runtime.openOptionsPage();
    return;
  }

  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    browser.tabs.sendMessage(tabs[0].id, { component: info.menuItemId });
  });
}

function hasInConfigAndIsTrue (key) {
  if (localData[key] === undefined || localData[key] === true) {
    return true;
  }

  return false;
}

function loadValues (data) {
  for (const key of Object.keys(data)) {
    if (localData[key] !== undefined) {
      localData[key] = data[key];
    }
  }

  if (useChrome) {
    if (!hasInConfigAndIsTrue('tc__translateMenu')) {
      chrome.contextMenus.update('deepl', { visible: false });
    } else {
      chrome.contextMenus.update('deepl', { visible: true });
    }

    if (!hasInConfigAndIsTrue('tc__openLinkMenu')) {
      chrome.contextMenus.update('linksBackground', { visible: false });
    } else {
      chrome.contextMenus.update('linksBackground', { visible: true });
    }

    if (!hasInConfigAndIsTrue('tc__openTextLinkMenu')) {
      chrome.contextMenus.update('textLinksBackground', { visible: false });
    } else {
      chrome.contextMenus.update('textLinksBackground', { visible: true });
    }

    if (!hasInConfigAndIsTrue('tc__wiktionaryMenu')) {
      chrome.contextMenus.update('wiktionary', { visible: false });
    } else {
      chrome.contextMenus.update('wiktionary', { visible: true });
    }

    if (!hasInConfigAndIsTrue('tc__geizhalsMenu')) {
      chrome.contextMenus.update('geizhals', { visible: false });
    } else {
      chrome.contextMenus.update('geizhals', { visible: true });
    }

    if (!hasInConfigAndIsTrue('tc__googleSelectionMenu')) {
      chrome.contextMenus.update('google', { visible: false });
    } else {
      chrome.contextMenus.update('google', { visible: true });
    }

    return false;
  }

  if (!hasInConfigAndIsTrue('tc__translateMenu')) {
    browser.contextMenus.update('deepl', { visible: false });
  } else {
    browser.contextMenus.update('deepl', { visible: true });
  }

  if (!hasInConfigAndIsTrue('tc__openLinkMenu')) {
    browser.contextMenus.update('linksBackground', { visible: false });
  } else {
    browser.contextMenus.update('linksBackground', { visible: true });
  }

  if (!hasInConfigAndIsTrue('tc__openTextLinkMenu')) {
    browser.contextMenus.update('textLinksBackground', { visible: false });
  } else {
    browser.contextMenus.update('textLinksBackground', { visible: true });
  }

  if (!hasInConfigAndIsTrue('tc__wiktionaryMenu')) {
    browser.contextMenus.update('wiktionary', { visible: false });
  } else {
    browser.contextMenus.update('wiktionary', { visible: true });
  }

  if (!hasInConfigAndIsTrue('tc__geizhalsMenu')) {
    browser.contextMenus.update('geizhals', { visible: false });
  } else {
    browser.contextMenus.update('geizhals', { visible: true });
  }

  if (!hasInConfigAndIsTrue('tc__googleSelectionMenu')) {
    browser.contextMenus.update('google', { visible: false });
  } else {
    browser.contextMenus.update('google', { visible: true });
  }
}

function onLoadError (err) {
  console.log('TextCompanion: Error while loading internal data in background page.');
  console.log(err);
}

if (useChrome) {
  chrome.runtime.onMessage.addListener(handleMessages);
  chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
    title: 'Translate selection using DeepL.com',
    id: 'deepl',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    title: 'Open links in background',
    id: 'linksBackground',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    title: 'Open textlinks in background',
    id: 'textLinksBackground',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    title: 'Wiktionary selection',
    id: 'wiktionary',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    title: 'Search Geizhals.eu for selection',
    id: 'geizhals',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    title: 'Google.com search selection',
    id: 'google',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    title: 'Open TextCompanion settings',
    id: 'settings',
    contexts: ['all']
  });

  chrome.contextMenus.onClicked.addListener(sendMessageToTab);
  chrome.storage.local.get().then(loadValues, onLoadError);
} else {
  browser.runtime.onMessage.addListener(handleMessages);
  browser.contextMenus.removeAll();

  browser.contextMenus.create({
    title: 'Translate selection using DeepL.com',
    id: 'deepl',
    contexts: ['selection'],
    icons: { 16: 'img/language-solid.svg' }
  });

  browser.contextMenus.create({
    title: 'Open links in background',
    id: 'linksBackground',
    contexts: ['selection'],
    icons: { 16: 'img/square-arrow-up-right-solid.svg' }
  });

  browser.contextMenus.create({
    title: 'Open textlinks in background',
    id: 'textLinksBackground',
    contexts: ['selection'],
    icons: { 16: 'img/link-solid.svg' }
  });

  browser.contextMenus.create({
    title: 'Wiktionary selection',
    id: 'wiktionary',
    contexts: ['selection'],
    icons: { 16: 'img/spell-check-solid.svg' }
  });

  browser.contextMenus.create({
    title: 'Search Geizhals.eu for selection',
    id: 'geizhals',
    contexts: ['selection'],
    icons: { 16: 'img/cart-shopping-solid.svg' }
  });

  browser.contextMenus.create({
    title: 'Google.com search selection',
    id: 'google',
    contexts: ['selection'],
    icons: { 16: 'img/magnifying-glass-solid.svg' }
  });

  browser.contextMenus.create({
    title: 'Open TextCompanion settings',
    id: 'settings',
    contexts: ['all']
  });

  browser.contextMenus.onClicked.addListener(sendMessageToTab);
  browser.storage.local.get().then(loadValues, onLoadError);
}
