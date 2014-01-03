(function () {
  DIV_ID = "study-guide-sidebar";
  PAGE_ID = "study-guide-page";
  if (!document.getElementById(DIV_ID)) {
    console.log("inject.js start");
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
      handles: 'n,w,s,e',
      minWidth: 200,
      maxWidth: 500,
      resize: function(event, ui) {
        $(this).css({left:''});
        resizePage();
      }
    });
  } else {
    $(DIV_ID).remove();
  }
  function resizePage() {
    console.log("resizePage");
    console.log($('body').innerWidth());
    console.log($('#' + DIV_ID));
    console.log($('#' + DIV_ID).outerWidth());
    console.log($('body').innerWidth() - $('#' + DIV_ID).outerWidth());
    $('#' + PAGE_ID).css({width: $('body').innerWidth() - $('#' + DIV_ID).outerWidth()});
    console.log($('#' + PAGE_ID).css('width'));
  }
})()