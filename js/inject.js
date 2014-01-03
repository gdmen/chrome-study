DIV_ID = "study-guide-sidebar";
PAGE_ID = "study-guide-page";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.greeting == "on") {
    on();
  } else if(request.greeting == "off") {
    off();
  } else {
    console.log(request.greeting);
  }
});

function on() {
  console.log("on");
  // Inject container
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
}

function off() {
  console.log("off");
  $('#' + DIV_ID).remove();
  $('#' + PAGE_ID).replaceWith($('#' + PAGE_ID).contents());
}

function resizePage() {
  $('#' + PAGE_ID).css({width: $('body').innerWidth() - $('#' + DIV_ID).outerWidth()});
}