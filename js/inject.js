DIV_ID = "study-guide-sidebar";
PAGE_ID = "study-guide-page";

STATE_KEY = 'study-guide-toggle';

STARTING_WIDTH = 300;
MIN_WIDTH = STARTING_WIDTH;

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
    console.log("togg-off");
    setLocal(STATE_KEY, false);
  } else {
    console.log("togg-on");
    setLocal(STATE_KEY, true);
  }
  $(setSidebar());
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
    off();
    chrome.runtime.sendMessage({greeting: "inject"}, function(response) {
    console.log("CSS INJECTED!");});
    // Inject container
    console.log("injecting?");
    $('body').wrapInner('<div id="' + PAGE_ID + '"/>');
    resizable_div = document.createElement("div");
    resizable_div.id = DIV_ID;
    document.body.appendChild(resizable_div);
    $('#' + DIV_ID).css({width: STARTING_WIDTH});
    resizePage();
    $('#study-guide-sidebar').resizable({
      handles: 'w',
      minWidth: MIN_WIDTH,
      resize: function(event, ui) {
        $(this).css({left:''});
      },
      stop: function(event, ui) {
        $(this).css({left:''});
        resizePage();
      }
    });
    iframe = document.createElement('iframe');
    iframe.src = chrome.extension.getURL('sidebar.html');
    resizable_div.appendChild(iframe);
}

function off() {
  console.log("off");
  while($('#' + DIV_ID).length > 0 || $('#' + PAGE_ID).length > 0) {
    $('#' + DIV_ID).remove();
    $('#' + PAGE_ID).replaceWith($('#' + PAGE_ID).contents());
  }
}

function resizePage(div_width) {
  div_width = typeof div_width != 'undefined' ? div_width : $('#' + DIV_ID).outerWidth();
  console.log($('body').innerWidth());
  console.log(div_width);
  $('#' + PAGE_ID).css({width: $('body').innerWidth() - div_width});
  console.log($('#' + PAGE_ID).css('width'));
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