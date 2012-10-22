$(document).ready(function () {

	var browserPrefix = "";

	if ($.browser.mozilla)	browserPrefix = "-moz-";
	if ($.browser.webkit)	browserPrefix = "-webkit-";
	if ($.browser.opera)	browserPrefix = "-o-";
	if ($.browser.msie)		browserPrefix = "-ms-";

	$("#content").css(browserPrefix + "transform", "perspective(9000) rotateY(0deg)");

  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

	$("#workNav a, .workUploadGalLink").live("click", function (e) {
		e.preventDefault();
		if ($(e.target).hasClass("current")) {
			return;
		} else {
			changeWorkTab($(e.target).attr("href"));
		}
	});

	function changeWorkTab (toTab) {
		console.log(toTab);
		if (toTab == "#gallery") {
			rotateContainer(false, function () {
				$("#studyCase").addClass("hidden");
				$(".workNavStudyCaseLink").removeClass("current");
				$("#gallery").removeClass("hidden");
				$(".workNavGalleryLink").addClass("current");
				rotateContainer(true, function () {
					$('html, body').animate({scrollTop:0}, 500);
					return;
				});
			});
		} else if (toTab == "#studyCase") {
			rotateContainer(false, function () {
				$("#gallery").addClass("hidden");
				$(".workNavGalleryLink").removeClass("current");
				$("#studyCase").removeClass("hidden");
				$(".workNavStudyCaseLink").addClass("current");
				rotateContainer(true, function () {
					$('html, body').animate({scrollTop:0}, 500);
					return;
				});
			});
		}
	}

	function rotateContainer (desc, callback) {
		var i,
				isOver = false;

		var rotate = function (newY) {
			$("#content").css(browserPrefix + "transform", "perspective(9000) rotateY(" + newY + "deg)");
			i+=9;
		};

		if (desc == true) {
			console.log("Desc");
			i = -90;
		} else {
			console.log("Asc");
			i = 0;
		}

		(function animloop(){
			if (isOver) {
				callback();
			} else {
				if (desc == true && i >= 0) {
					isOver = true;
					$("#content").css(browserPrefix + "transform", "perspective(9000) rotateY(0deg)");
					callback();
				} else if (desc == false && i >= 90) {
					isOver = true;
					$("#content").css(browserPrefix + "transform", "perspective(9000) rotateY(90deg)");
					callback();
				} else {
					rotate(i);
					requestAnimFrame(animloop);
				}
			}
	  })();
		
	}

});