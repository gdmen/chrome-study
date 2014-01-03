(function () {
  DIV_ID = "study-guide-sidebar";
  if (!document.getElementById(DIV_ID)) {
    console.log("inject.js start");
    iframe = document.createElement('iframe');
    iframe.src = chrome.extension.getURL('sidebar.html');
    resizable_div = document.createElement("div");
    resizable_div.id = DIV_ID;
    //resizable_div.appendChild(iframe);
    document.body.appendChild(resizable_div);
    console.log("inject.js resizable");
    $('#study-guide-sidebar').resizable({
      handles: 'n,w,s,e',
      minWidth: 200,
      maxWidth: 500,
      resize: function(event, ui) {
        $(this).css({left:''});
      }
    });
  } else {
    div = document.getElementById(DIV_ID);
    div.parentNode.removeChild(div);
  }
})()