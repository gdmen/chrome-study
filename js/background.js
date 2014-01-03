chrome.browserAction.onClicked.addListener(function(e) {
  console.log("onClicked");
  toggleActiveTab();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log("onUpdated");
  setActiveTab();
});

chrome.tabs.onCreated.addListener(function(tab) {
  console.log("onCreated");
  setActiveTab();
});

function setActiveTab() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "set"});
  });
}

function toggleActiveTab() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "toggle"});
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
    console.log(request.greeting);
  }
});