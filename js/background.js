var STATE_KEY = 'study-guide-toggle-';

function getToggle(tab_id) {
  var key = STATE_KEY + tab_id;
  if(!isset(key)) {
    setLocal(key, false);
  }
  return JSON.parse(getLocal(key));
}
function toggle(tab_id) {
  console.log("toggle");
  setLocal(STATE_KEY + tab_id, !getToggle(tab_id));
}

function isset(key) {
  return !(localStorage.getItem(key) === null);
}

function setLocal(key, value) {
  localStorage[key] = value;
}

function getLocal(key) {
  return localStorage[key];
}

function delLocal(key) {
  localStorage.removeItem(key);
}

chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("onClicked");
  toggle(tab.id);
  msgActiveTab(getToggle(tab.id) ? "on" : "off");
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log("onUpdated");
  msgActiveTab(getToggle(tab.id) ? "on" : "off");
});

chrome.tabs.onCreated.addListener(function(tab) {
  console.log("onCreated");
  msgActiveTab(getToggle(tab.id) ? "on" : "off");
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  delLocal(STATE_KEY + tabId);
});

function msgActiveTab(msg) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: msg});
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.greeting == "inject") {
    console.log("INJECTING");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.insertCSS(tabs[0].id, {file: "css/ui-lightness/jquery-ui.min.css"});
      chrome.tabs.insertCSS(tabs[0].id, {file: "css/inject.css"});
    });
    sendResponse({farewell: ""});
  } else {
    console.log("UNKNOWN: " + request.greeting);
  }
});