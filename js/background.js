chrome.browserAction.onClicked.addListener(function(e) {
  chrome.tabs.insertCSS(null, {file: "css/ui-lightness/jquery-ui.min.css"});
  chrome.tabs.insertCSS(null, {file: "css/inject.css"});
  chrome.tabs.executeScript(null, {file: "js/libs/jquery.min.js"});
  chrome.tabs.executeScript(null, {file: "js/libs/jquery-ui.min.js"});
  chrome.tabs.executeScript(null, {file: "js/inject.js"});
});