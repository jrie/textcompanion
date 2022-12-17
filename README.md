# textcompanion
Browser addon to work on text selections. Quickly lookup, translate, search, and open links in background.

### Status
There is currently no released version published in either Firefox, Chrome and Opera addon/extension pages/stores. But you can quickly test out the current state of the addon by following the steps as following.


### Firefox
In order for the addon to be loaded into Firefox, follow these steps:
* Download the repository
* Navigate in Firefox to `about:debugging`, select "This Firefox" and inside "Temporary extensions" click the button "Load Temporary Add-on", open the `textcompanion` folder.


### Chrome/Opera note
In order for the addon to be loaded into Chrome or Opera, follow these steps:
* Download the repository
* Remove or rename the `manifest.json` file, because it is belonging to the Firefox manifest v2 setup
* Copy and rename the file `manifest_v3_chrome.json` to `manifest.json`
* Load the addon from the extension page: This is either `chrome://extensions` for Chrome and `opera://extensions` for Opera.
