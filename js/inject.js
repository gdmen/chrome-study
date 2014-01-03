DIV_ID = "study-guide-sidebar";
PAGE_ID = "study-guide-page";

STATE_KEY = 'study-guide-toggle-';

if(!isset(STATE_KEY)) {
  console.log("not set");
  setLocal(STATE_KEY, false);
  setSidebar();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.greeting == "toggle") {
    console.log("toggle-msg");
    toggle();
  } else if(request.greeting == "set") {
    console.log("set-msg");
    setSidebar();
  } else {
    console.log(request.greeting);
  }
});

function toggle() {
  console.log("toggle");
  var enabled = getLocal(STATE_KEY);
  if(enabled) {
    setLocal(STATE_KEY, false);
  } else {
    setLocal(STATE_KEY, true);
  }
  setSidebar();
}

function setSidebar() {
  var enabled = getLocal(STATE_KEY);
  if(enabled) {
    on();
  } else {
    off();
  }
}

function on() {
  console.log("on");
  chrome.runtime.sendMessage({greeting: "inject"}, function(response) {
    // Inject container
    console.log("injecting?");
    $('body').wrapInner('<div id="' + PAGE_ID + '"/>');
    
    iframe = document.createElement('iframe');
    iframe.src = chrome.extension.getURL('sidebar.html');
    resizable_div = document.createElement("div");
    resizable_div.id = DIV_ID;
    //resizable_div.appendChild(iframe);
    document.body.appendChild(resizable_div);
    resizePage();
    $('#study-guide-sidebar').resizable({
      handles: 'w',
      minWidth: 300,
      resize: function(event, ui) {
        $(this).css({left:''});
        resizePage();
      }
    });
  });
}

function off() {
  console.log("off");
  $('#' + DIV_ID).remove();
  $('#' + PAGE_ID).replaceWith($('#' + PAGE_ID).contents());
}

function resizePage() {
  $('#' + PAGE_ID).css({width: $('body').innerWidth() - $('#' + DIV_ID).outerWidth()});
}

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