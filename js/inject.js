var DIV_ID = "study-guide-sidebar";
var PAGE_ID = "study-guide-page";

var STARTING_WIDTH = 300;
var MIN_WIDTH = STARTING_WIDTH;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.cmd == "on") {
    console.log("on-msg");
    on();
  } else if(request.cmd == "off") {
    console.log("off-msg");
    off();
  } else if(request.cmd == "bookmark_dump") {
    console.log("bookmark_dump-msg");
    console.log(JSON.parse(request.payload));
  }else {
    console.log("UNKNOWN: " + request.cmd);
  }
});

function on() {
  console.log("on");
  off();
  chrome.runtime.sendMessage({cmd: "inject"}, function(response) {
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
    start: function(event, ui) {
      $('#' + DIV_ID + ' iframe').css('pointer-events', 'none');
    },
    resize: function(event, ui) {
      $(this).css({left:''});
      //resizePage();
    },
    stop: function(event, ui) {
      $(this).css({left:''});
      $('#' + DIV_ID + ' iframe').css('pointer-events', 'auto');
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
  //console.log($('body').innerWidth());
  //console.log(div_width);
  $('#' + PAGE_ID).css({width: $('body').innerWidth() - div_width});
  //console.log($('#' + PAGE_ID).css('width'));
}