function isset(key) {
  return !(localStorage.getItem(key) === null);
}
/*
 * Sets to local storage
 * @params:
 *    - key
 *    - value
 * @returns:
 *    none
 */
function setLocal(key, value){
  localStorage[key] = value;
}
/*
 * Gets from local storage
 * @params:
 *    - key
 * @returns:
 *    - value on presence
 *    - undefined on absence
 */
function getLocal(key){
  return JSON.parse(localStorage[key]);
}

TOGGLE = 'study-guide-toggle';
if(!isset(TOGGLE)) {
  console.log("not set");
  setLocal(TOGGLE, false);
  refreshAllTabs(getLocal(TOGGLE));
}

chrome.browserAction.onClicked.addListener(function(e) {
  toggle = getLocal(TOGGLE);
  if(toggle) {
    setLocal(TOGGLE, false);
  } else {
    setLocal(TOGGLE, true);
  }
  toggle = getLocal(TOGGLE);
  console.log("Toggle onClicked " + toggle);
  refreshAllTabs(toggle);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  toggle = getLocal(TOGGLE);
  console.log("Toggle onUpdated " + toggle);
  refreshTab(tab, toggle)
});

chrome.tabs.onCreated.addListener(function(tab) {
  toggle = getLocal(TOGGLE);
  console.log("Toggle onCreated " + toggle);
  refreshTab(tab, toggle)
});

function refreshTab(tab, toggle) {
  if(toggle) {
    chrome.tabs.insertCSS(tab.id, {file: "css/ui-lightness/jquery-ui.min.css"});
    chrome.tabs.insertCSS(tab.id, {file: "css/inject.css"});
    chrome.tabs.sendMessage(tab.id, {greeting: "on"});
  } else {
    chrome.tabs.sendMessage(tab.id, {greeting: "off"});
  }
}

function refreshAllTabs(toggle) {
  console.log("refreshTabs: " + toggle);
  chrome.tabs.query({active: true}, function(tabs) {
    for (var i = 0; i < tabs.length; i++) {
      refreshTab(tabs[i], toggle);
    }
  });
  chrome.tabs.query({active: false}, function(tabs) {
    for (var i = 0; i < tabs.length; i++) {
      refreshTab(tabs[i], toggle);
    }
  });
}