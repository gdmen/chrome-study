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
  msgTab(tab.id, { cmd: getToggle(tab.id) ? "on" : "off" });
  sendBookmarks(tab.id);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log("onUpdated");
  msgTab(tab.id, { cmd: getToggle(tab.id) ? "on" : "off" });
});

chrome.tabs.onCreated.addListener(function(tab) {
  console.log("onCreated");
  msgTab(tab.id, { cmd: getToggle(tab.id) ? "on" : "off" });
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  delLocal(STATE_KEY + tabId);
});

function msgTab(tab_id, msg) {
  chrome.tabs.sendMessage(tab_id, msg);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.cmd == "inject") {
    console.log("INJECTING");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.insertCSS(tabs[0].id, {file: "css/ui-lightness/jquery-ui.min.css"});
      chrome.tabs.insertCSS(tabs[0].id, {file: "css/inject.css"});
    });
    sendResponse({farewell: ""});
  } else {
    console.log("UNKNOWN: " + request.cmd);
  }
});

function sendBookmarks(tab_id) {
  chrome.bookmarks.getTree(function(results) {
    msgTab(tab_id, { cmd: "bookmark_dump", payload: JSON.stringify(recurseBookmarks(results[0].children), undefined, 2) });
  });
  function recurseBookmarks(nodes) {
    var node_details = [];
    var i;
    for(i = 0; i < nodes.length; i++) {
      if(!nodes[i].children) {
        node_details.push({ title: nodes[i].title, url: nodes[i].url });
      } else {
        node_details.push({ title: nodes[i].title, children: recurseBookmarks(nodes[i].children) });
      }
    }
    return node_details;
  }
}