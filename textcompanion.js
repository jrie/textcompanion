// --------------------------------------------------------------------
const useChrome = typeof (browser) === 'undefined'

// --------------------------------------------------------------------
let foundLinks = []
let hasLinks = false
let textLinks = []
let hasTextLinks = false
let selectedText = ''
const localData = {
  tc__translateButton: true,
  tc__openLinkButton: true,
  tc__wiktionaryButton: true,
  tc__geizhalsButton: true,
  tc__googleSelectionButton: true,
  tc__openTextLinkButton: true,
  tc__translateLanguage: 'en'
}

// --------------------------------------------------------------------
function findLinks (selection) {
  let html = ''
  const parents = []

  for (let x = 0; x < selection.rangeCount; ++x) {
    const range = selection.getRangeAt(x)
    const commonAncestor = range.commonAncestorContainer

    let srcParent = commonAncestor
    if (srcParent.nodeName === '#text') {
      while (selection.containsNode(srcParent, false) || srcParent.nodeName === 'SPAN') {
        srcParent = srcParent.parentNode
      }
    }

    html += srcParent.outerHTML
    parents.push(srcParent.parentNode)
  }

  hasTextLinks = false
  textLinks = selection.toString().match(/(http|https):\/\/.[^ ]*/gi)
  if (textLinks !== null) {
    hasTextLinks = true
    console.log('Found ' + textLinks.length + ' textlinks in selection')
  }

  let links = html.match(/href=["'][^"']*/gi)
  if (links !== null) {
    const tmpLinks = []
    for (let x = 0; x < links.length; ++x) {
      links[x] = links[x].substring(6)
      if (tmpLinks.indexOf(links[x]) === -1) {
        tmpLinks.push(links[x])
      }
    }

    links = tmpLinks

    let linksInSelection = 0
    foundLinks = []

    const domainMatch = window.location.href.match(/http[s]{0,1}:\/\/[^/]*/gi)

    let baseDomain = ''
    if (domainMatch !== null) {
      baseDomain = domainMatch[0]
    } else {
      console.log('TextCompanion base domain could not be detected.')
      return
    }

    for (const parent of parents) {
      for (const link of links) {
        const foundLink = parent.querySelector('a[href="' + link + '"]')
        if (foundLink !== null && selection.containsNode(foundLink, true)) {
          const linkUrl = foundLink.href
          if (linkUrl.startsWith('/') || linkUrl.startsWith('#')) {
            foundLinks.push(baseDomain + linkUrl)
          } else {
            foundLinks.push(linkUrl)
          }

          ++linksInSelection
        }
      }
    }

    if (linksInSelection !== 0) {
      console.log('Detected links:', linksInSelection)
      return true
    }
  }

  return false
}

// --------------------------------------------------------------------
function openTextLinkTabsInBackground (evt) {
  evt.preventDefault()
  if (window.confirm('This will open ' + textLinks.length + ' ' + (textLinks.length === 1 ? 'tab' : 'tabs') + ', proceed?')) {
    if (useChrome) {
      chrome.runtime.sendMessage({ links: textLinks })
    } else {
      browser.runtime.sendMessage({ links: textLinks })
    }
  }
}

// --------------------------------------------------------------------
function openTabsInBackground (evt) {
  evt.preventDefault()
  if (window.confirm('This will open ' + foundLinks.length + ' ' + (foundLinks.length === 1 ? 'tab' : 'tabs') + ', proceed?')) {
    if (useChrome) {
      chrome.runtime.sendMessage({ links: foundLinks })
    } else {
      browser.runtime.sendMessage({ links: foundLinks })
    }
  }
}

// --------------------------------------------------------------------
function googleSelection (evt) {
  evt.preventDefault()

  const lineDelimeter = ''
  const searchWords = selectedText.replace(/[\t]{1,}/g, ' ').replace(/[ ]{2,}/g, '').replace(/[\n\r]{1,}/g, lineDelimeter).trim()

  if (useChrome) {
    chrome.runtime.sendMessage({ links: ['https://www.google.com/search?q=' + searchWords] })
  } else {
    browser.runtime.sendMessage({ links: ['https://www.google.com/search?q=' + searchWords] })
  }
}

// --------------------------------------------------------------------
function geizhalsSelection (evt) {
  evt.preventDefault()

  const lineDelimeter = ''
  const articleName = selectedText.replace(/[\n\r]{1,}/g, lineDelimeter).replace(/[\t]{1,}/g, '').replace(/[ ]{1,}/g, '+').trim()

  if (articleName.length > 256) {
    window.alert('The article name is more than 256 characters, not looking up in Geizhals.eu')
    return
  }

  if (useChrome) {
    chrome.runtime.sendMessage({ links: ['https://geizhals.eu/?fs=' + articleName] })
  } else {
    browser.runtime.sendMessage({ links: ['https://geizhals.eu/?fs=' + articleName] })
  }
}

// --------------------------------------------------------------------
function wiktionarySelection (evt) {
  evt.preventDefault()
  const lineDelimeter = ''
  const wikitext = selectedText.replace(/[\t]{1,}/g, ' ').replace(/[ ]{2,}/g, '').replace(/[\n\r]{1,}/g, lineDelimeter).trim()

  if (wikitext.length > 128) {
    window.alert('The selected text is ' + wikitext.length + ' characters long and will not be looked up in Wiktionary on purpose.')
    return
  }

  const srcLang = document.documentElement.lang !== '' ? document.documentElement.lang.split('_', 2)[0].split('-', 2)[0] : ''

  if (useChrome) {
    chrome.runtime.sendMessage({ links: ['https://' + (srcLang === '' ? localData.tc__translateLanguage : srcLang) + '.wiktionary.org/wiki/' + wikitext] })
  } else {
    browser.runtime.sendMessage({ links: ['https://' + (srcLang === '' ? localData.tc__translateLanguage : srcLang) + '.wiktionary.org/wiki/' + wikitext] })
  }
}

// --------------------------------------------------------------------
function translateSelection (evt) {
  evt.preventDefault()
  const lineDelimeter = '%0A%0A'
  const translationText = selectedText.replace(/%/g, '%25').replace(/\//g, '\\%2F').replace(/[\t]{1,}/g, ' ').replace(/[ ]{2,}/g, '').replace(/[\n\r]{1,}/g, lineDelimeter).trim()

  if (translationText.length > 5000) {
    window.alert('The selected text is ' + translationText.length + ' characters long and cannot be translated using the DeepL web interface.')
    return
  }

  const srcLang = document.documentElement.lang !== '' ? document.documentElement.lang.split('_', 2)[0].split('-', 2)[0] : ''
  if (useChrome) {
    chrome.runtime.sendMessage({
      links: ['https://www.deepl.com/translator#' + (srcLang === '' ? 'en' : srcLang) + '/' + localData.tc__translateLanguage + '/' + translationText]
    })
  } else {
    browser.runtime.sendMessage({
      links: ['https://www.deepl.com/translator#' + (srcLang === '' ? 'en' : srcLang) + '/' + localData.tc__translateLanguage + '/' + translationText]
    })
  }
}

// --------------------------------------------------------------------
function updateMouseData (evt) {
  const existingOverlayDiv = document.getElementById('textCompanionOverlay')
  if (existingOverlayDiv !== null) {
    const selection = window.getSelection()
    if (selection.type !== null) {
      if (!existingOverlayDiv.classList.contains('disabled')) {
        if (evt.target.parentNode === existingOverlayDiv || evt.target === existingOverlayDiv) {
          return
        }
      }

      if (selection.type !== 'Range') {
        existingOverlayDiv.classList.add('disabled')
        return
      }

      let x = evt.pageX - (existingOverlayDiv.clientWidth * 0.5)
      let y = evt.pageY

      if (x < existingOverlayDiv.clientWidth * 1.25) {
        x += existingOverlayDiv.clientWidth * 0.5
      }

      if (y < existingOverlayDiv.clientHeight * 2) {
        y += existingOverlayDiv.clientHeight * 1.5
      }

      if (x + (existingOverlayDiv.clientWidth * 1.5) >= document.body.clientWidth) {
        x = document.body.clientWidth - (existingOverlayDiv.clientWidth * 1.5)
      }

      existingOverlayDiv.style.left = 'calc(' + x + 'px)'
      existingOverlayDiv.style.top = 'calc(' + y + 'px - ' + existingOverlayDiv.clientHeight + 'px - 1.75em)'
      existingOverlayDiv.classList.remove('disabled')
      return
    }

    existingOverlayDiv.classList.add('disabled')
  }
}

// --------------------------------------------------------------------
function hasActiveButtonInConfig (key) {
  if (localData[key] === undefined || localData[key] === true) {
    return true
  }

  return false
}

// --------------------------------------------------------------------
function selectionChangeEvent (evt) {
  const selection = window.getSelection()
  const existingOverlayDiv = document.getElementById('textCompanionOverlay')
  if (existingOverlayDiv !== null && !existingOverlayDiv.classList.contains('disabled')) {
    existingOverlayDiv.classList.add('disabled')
  }

  if (selection.type !== 'Range') {
    return
  }

  hasLinks = findLinks(selection)
  if (!hasLinks) {
    console.log('TextCompanion: No links found.')
  }

  selectedText = selection.toString()

  if (useChrome) {
    chrome.storage.local.get().then(loadValues, onLoadError)
  } else {
    browser.storage.local.get().then(loadValues, onLoadError)
  }
}

// --------------------------------------------------------------------
function loadValues (data) {
  for (const key of Object.keys(data)) {
    if (localData[key] !== undefined) {
      localData[key] = data[key]
    }
  }

  updateUI()

  if (window.location.href.endsWith('page_settings.html') && window.location.href.indexOf('extension') !== -1) {
    return
  }

  const selection = window.getSelection()
  if (selection.type !== 'Range') {
    return
  }

  selectedText = selection.toString()
  recreateUI()
}

// --------------------------------------------------------------------
function recreateUI () {
  const existingOverlay = document.getElementById('textCompanionOverlay')
  const overlayDiv = document.createElement('div')

  if (existingOverlay !== null) {
    overlayDiv.style.left = existingOverlay.style.left
    overlayDiv.style.top = existingOverlay.style.top
    existingOverlay.parentNode.removeChild(existingOverlay)
  }

  overlayDiv.id = 'textCompanionOverlay'
  // overlayDiv.classList.add('disabled')

  let hasElement = false

  if (hasActiveButtonInConfig('tc__translateButton')) {
    const translateButton = document.createElement('button')
    translateButton.href = '#'
    translateButton.id = 'tc__translateButton'
    translateButton.title = 'Translate selection using DeepL.com'
    translateButton.appendChild(document.createTextNode(translateButton.title))
    translateButton.addEventListener('click', translateSelection)
    overlayDiv.appendChild(translateButton)
    hasElement = true
  }

  if (hasActiveButtonInConfig('tc__openLinkButton')) {
    const openLinkButton = document.createElement('button')
    openLinkButton.href = '#'
    openLinkButton.id = 'tc__openLinkButton'
    openLinkButton.title = 'Open links in background'
    openLinkButton.appendChild(document.createTextNode(openLinkButton.title))

    if (hasLinks) {
      openLinkButton.addEventListener('click', openTabsInBackground)
    } else {
      openLinkButton.setAttribute('disabled', 'disabled')
    }

    overlayDiv.appendChild(openLinkButton)
    hasElement = true
  }

  if (hasActiveButtonInConfig('tc__openTextLinkButton')) {
    const openTextLinkButton = document.createElement('button')
    openTextLinkButton.href = '#'
    openTextLinkButton.id = 'tc__openTextLinkButton'
    openTextLinkButton.title = 'Open selected text links in background'
    openTextLinkButton.appendChild(document.createTextNode(openTextLinkButton.title))

    if (hasTextLinks) {
      openTextLinkButton.addEventListener('click', openTextLinkTabsInBackground)
    } else {
      openTextLinkButton.setAttribute('disabled', 'disabled')
    }

    overlayDiv.appendChild(openTextLinkButton)
    hasElement = true
  }

  if (hasActiveButtonInConfig('tc__wiktionaryButton')) {
    const wiktionaryButton = document.createElement('button')
    wiktionaryButton.href = '#'
    wiktionaryButton.id = 'tc__wiktionaryButton'
    wiktionaryButton.title = 'Look up in Wiktionary'
    wiktionaryButton.appendChild(document.createTextNode(wiktionaryButton.title))
    wiktionaryButton.addEventListener('click', wiktionarySelection)
    overlayDiv.appendChild(wiktionaryButton)
    hasElement = true
  }

  if (hasActiveButtonInConfig('tc__geizhalsButton')) {
    const geizhalsButton = document.createElement('button')
    geizhalsButton.href = '#'
    geizhalsButton.id = 'tc__geizhalsButton'
    geizhalsButton.title = 'Look up in Geizhals.eu'
    geizhalsButton.appendChild(document.createTextNode(geizhalsButton.title))
    geizhalsButton.addEventListener('click', geizhalsSelection)
    overlayDiv.appendChild(geizhalsButton)
    hasElement = true
  }

  if (hasActiveButtonInConfig('tc__googleSelectionButton')) {
    const googleButton = document.createElement('button')
    googleButton.href = '#'
    googleButton.id = 'tc__googleSelectionButton'
    googleButton.title = 'Google.com selection'
    googleButton.appendChild(document.createTextNode(googleButton.title))
    googleButton.addEventListener('click', googleSelection)
    overlayDiv.appendChild(googleButton)
    hasElement = true
  }

  if (hasElement) {
    document.body.appendChild(overlayDiv)
  }
}

// --------------------------------------------------------------------
function updateUI () {
  for (const key of Object.keys(localData)) {
    const uiTarget = document.getElementById(key)
    if (uiTarget !== null) {
      if (uiTarget.getAttribute('type') === 'checkbox') {
        if (localData[key] === true) {
          uiTarget.setAttribute('checked', 'checked')
        } else {
          uiTarget.removeAttribute('checked')
        }
      } else if (uiTarget.getAttribute('type') === 'text') {
        uiTarget.value = localData[key]
      }
    }
  }
}

// --------------------------------------------------------------------
function saveValues (data) {
  if (useChrome) {
    chrome.storage.local.set(data).then(function () {
      console.log('TextCompanion: Data saved.')
      updateUI()
    }, function (err) {
      console.log('TextCompanion: Error saving data.')
      console.log(err)
      updateUI()
    })
  } else {
    browser.storage.local.set(data).then(function () {
      console.log('TextCompanion: Data saved.')
      updateUI()
    }, function (err) {
      console.log('TextCompanion: Error saving data.')
      console.log(err)
      updateUI()
    })
  }
}

// --------------------------------------------------------------------
function saveData (evt) {
  evt.preventDefault()

  const target = evt.target
  const key = target.getAttribute('id')

  if (target.getAttribute('type') === 'checkbox') {
    if (target.getAttribute('checked') === null) {
      target.setAttribute('checked', 'checked')
      localData[key] = true
    } else {
      target.removeAttribute('checked')
      localData[key] = false
    }
  } else if (target.getAttribute('type') === 'text') {
    let keyValue = target.value.trim()
    if (key === 'tc__translateLanguage') {
      if (keyValue.length !== 0 && keyValue.length < 2) {
        window.alert('Language code must consists of two letters. Like "de" for German, "en" for English, or "fr" for French.')
        return
      } else if (keyValue.length > 2) {
        window.alert('Language code must consists of two letters. Like "de" for German, "en" for English, or "fr" for French.')
        return
      } else if (keyValue.length === 0) {
        keyValue = 'en'
      }

      keyValue = keyValue.toLowerCase()
      target.value = keyValue
    }

    localData[key] = keyValue
  }

  saveValues(localData)
}

// --------------------------------------------------------------------
function onLoadError (err) {
  console.log('TextCompanion: Error while loading internal data.')
  console.log(err)
}

// --------------------------------------------------------------------
function reloadUI (evt) {
  if (window.location.href.endsWith('page_settings.html') && window.location.href.indexOf('extension') !== -1) {
    return
  }

  if (useChrome) {
    chrome.storage.local.get().then(loadValues, onLoadError)
  } else {
    browser.storage.local.get().then(loadValues, onLoadError)
  }
}

// --------------------------------------------------------------------
if (window.location.href.endsWith('page_settings.html') && window.location.href.indexOf('extension') !== -1) {
  const buttonSettings = document.querySelectorAll('#buttonSettings .buttonOption')
  for (const item of buttonSettings) {
    item.addEventListener('change', saveData)
  }

  const textSettings = document.querySelectorAll('#textSettings .textOption')
  for (const item of textSettings) {
    item.addEventListener('change', saveData)
  }
}

// --------------------------------------------------------------------
document.addEventListener('mouseup', updateMouseData)
document.addEventListener('selectionchange', selectionChangeEvent)
document.addEventListener('visibilitychange', reloadUI)
/*
if (useChrome) {
  chrome.storage.local.get().then(loadValues, onLoadError)
} else {
  browser.storage.local.get().then(loadValues, onLoadError)
}
*/

console.log('TextCompanion: Initialized TextCompanion..')
