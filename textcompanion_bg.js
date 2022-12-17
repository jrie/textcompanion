// --------------------------------------------------------------------
const useChrome = typeof (browser) === 'undefined'

// --------------------------------------------------------------------
function handleMessages (message) {
  function openTabLinks (currentTab) {
    let index = -1
    if (currentTab !== undefined) {
      index = currentTab.pop().index
    }

    if (message.links !== undefined) {
      if (useChrome) {
        for (const linkUrl of message.links) {
          chrome.tabs.create({ active: false, url: linkUrl, index: ++index })
        }
      } else {
        for (const linkUrl of message.links) {
          browser.tabs.create({ active: false, url: linkUrl, index: ++index })
        }
      }
    }
  }

  if (useChrome) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, openTabLinks)
  } else {
    browser.tabs.query({ active: true, lastFocusedWindow: true }, openTabLinks)
  }
}

// --------------------------------------------------------------------
if (useChrome) {
  chrome.runtime.onMessage.addListener(handleMessages)
} else {
  browser.runtime.onMessage.addListener(handleMessages)
}
