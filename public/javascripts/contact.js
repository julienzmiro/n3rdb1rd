$(document).ready(function () {
  var closeEmail = function () {
    $("#contactBlockEmail").addClass("closed");
  };
  var openEmail = function () {
    $("#contactBlockEmail").unbind("click");
    $("#contactBlockEmail").addClass("opening");
    $("#contactBlockEmail").animate({height:"630px"}, 200, function () {
      $("#contactBlockEmail").removeClass("closed");
      $("#contactBlockEmail").removeClass("opening");
    });
  };

  var init = (function () {
    var urlFragment = window.location.href.slice(window.location.href.indexOf('#') + 1);

    $("#contactBlockEmail").bind("click", function() {
      openEmail();
    });

    if (urlFragment == "email") {
      openEmail();
    }

  })();
});