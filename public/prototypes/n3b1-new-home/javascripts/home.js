// TODO : minimiser le fouc notamment sur la typo soit en placant un preload, soit en placant les scripts juste apres les css
$(document).ready(function () {
	var didScroll = false,
		scrolledValue = 0,
		scrolledPercent = 0,
		browserPrefix = "";

	// shim layer with setTimeout fallback
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

	function init () {

		if ($.browser.mozilla)	browserPrefix = "-moz-";
		if ($.browser.webkit)	browserPrefix = "-webkit-";
		if ($.browser.opera)	browserPrefix = "-o-";
		if ($.browser.msie)		browserPrefix = "-ms-";

		$(window).bind("resize", function (e) {
			if (!$(window).scrollTop() > 0) {
				initLayout();	
			}
			resizeText();
			resizeBubbles();
		});

		$("#logoLink, #portfolioLink").bind("click", function (e) {
			e.preventDefault();
			$("body").animate({scrollTop : 0}, 800);
		});

		resizeText();
		resizeBubbles();

		if ($(window).height() > 534 && $(window).width() > 879) {
			initAnim();
		}
	};

	function initAnim () {
		var $square = $("#homeImgSuitedSquare");

		$(window).bind("scroll", function (e) {
			scrollHandler();
		});

		$square.detach();
		$("#homeImgSmartSquare, #homeImgHelpfulSquare").remove();
		$square.attr("id", "homeMainSquare");
		$("#homeScreen2").before($square);
		$("#content").prepend('<div id="scrollWrapper"></div>');
		
		initLayout();
		scrollHandler();

		(function animloop(){
	      	requestAnimFrame(animloop);
	      	if(didScroll){
				animate();
				didScroll = false;
			}
	    })();
	};

	function initLayout () {
		// * 7 de base a ajuster pour la vitesse
		$("#scrollWrapper").css("height", $(window).height() * 11);

		$(".animScreen").css({position: "fixed"});
		$(".animScreen").not("#homeScreen1").css({opacity: 0});

		//$("#homeScreen2").css("margin-top", $(window).height() + "px");
		$(".animScreen").each(function (i, elem) {
			$(this).css("top", ($(window).height() / 2 - $(this).height() / 2) + "px");
			$(this).css("margin-top", $(window).height() + "px");
		});
		$("#homeScreen1").css("margin-top", "0px");

		$("#homeMainSquare").css({
			position: "fixed",
			top: parseInt($("#homeScreen2").css("top")) + 10 + "px",
			left: $("#homeImgSuitedLine").offset().left + $("#homeImgSuitedLine").width() / 2 - $("#homeMainSquare").width() / 2 + "px",
			opacity: 0
		});

		// Correction img homeScreen5
		$("#homeImgHelpfulLine").css("bottom", "22px");
		$("#homeImgHelpfulGearSmall").css("bottom", "32px");
		$("#homeImgHelpfulGearBig").css("bottom", "42px");
		$("#homeImgHelpfulHeart").css("top", "-22px");

		$("#homeScreen6 *:not(#homeAboutLeft, #homeAge, #homeHob, #homeAct, #homeAgeRight, img, #homeActContainer, #homeQuote)").css("opacity", 0);
		
		$("#mainNav").css("margin-top", $(window).height() / 2 - $("#mainNav").height() / 2 - 35 + "px");

	};

	function scrollHandler () {
		scrolledValue = $(window).scrollTop();
		scrolledPercent = Math.floor((scrolledValue / $(document).height()) * 100);
		didScroll = true;
	};

	function animate () {

		/*******************
		homeScreen1
		*******************/
		$("#homeScreen1").css("opacity", 1 - (scrolledPercent / 4));
		$("#homeScreen1").css("margin-top", 0 - 2000 * (getLocalPercent(5, 12) / 100) + "px");
		/*******************
		mainNav
		*******************/
		$("#mainNav").css("margin-top", 100 + (($(window).height() / 2 - $("#mainNav").height() / 2 - 135) * (1 - getLocalPercent(0.5, 6) / 100)) + "px");
		/*******************
		homeScreen2
		*******************/
		$("#homeScreen2").css("opacity", 0 + (scrolledPercent / 5));
		// max marginTop : $(window).height() min marginTop : 0
		$("#homeScreen2").css("margin-top", 0 + Math.floor((((100 - Math.min((scrolledPercent * 10), 100)) / 100) * $(window).height())) + "px");
		/*******************
		homeMainSquare
		*******************/
		$("#homeMainSquare").css("opacity", 0 + getLocalPercent(17, 27) / 100);
		/*******************
		homeImgRea1
		*******************/
		// 0 a 55
		$("#homeImgRea1").css(browserPrefix + "transform", "rotate(" + Math.floor(0 + (getLocalPercent(11, 21) / 100) * 55) + "deg)");
		// 0 a scrolledValue
		$("#homeImgRea1").css("top", 0 + Math.floor((getLocalPercent(11, 23) / 100) * -(scrolledValue )) + "px");
		// 0 a windowWidth
		$("#homeImgRea1").css("left", 0 + Math.floor((getLocalPercent(11, 23) / 100) * $(window).width()) + "px");
		/*******************
		homeImgRea2
		*******************/
		// 2 a 55
		$("#homeImgRea2").css(browserPrefix + "transform", "rotate(" + Math.floor(2 + (getLocalPercent(14, 24) / 100) * 55) + "deg)");
		// 0 a scrolledValue
		$("#homeImgRea2").css("top", 0 + Math.floor((getLocalPercent(14, 27) / 100) * -(scrolledValue )) + "px");
		// 0 a windowWidth
		$("#homeImgRea2").css("left", 0 + Math.floor((getLocalPercent(14, 27) / 100) * $(window).width()) + "px");
		/*******************
		homeImgRea3
		*******************/
		// -2 a 55
		$("#homeImgRea3").css(browserPrefix + "transform", "rotate(" + Math.floor(-2 + (getLocalPercent(17, 27) / 100) * 55) + "deg)");
		// 0 a scrolledValue
		$("#homeImgRea3").css("top", 0 + Math.floor((getLocalPercent(17, 29) / 100) * -(scrolledValue )) + "px");
		// 0 a windowWidth
		$("#homeImgRea3").css("left", 0 + Math.floor((getLocalPercent(17, 29) / 100) * $(window).width()) + "px");
		/*******************
		homeImgRea4
		*******************/
		// 1 a 55
		$("#homeImgRea4").css(browserPrefix + "transform", "rotate(" + Math.floor(1 + (getLocalPercent(20, 30) / 100) * 55) + "deg)");
		// 0 a scrolledValue
		$("#homeImgRea4").css("top", 0 + Math.floor((getLocalPercent(20, 32) / 100) * -(scrolledValue )) + "px");
		// 0 a windowWidth
		$("#homeImgRea4").css("left", 0 + Math.floor((getLocalPercent(20, 32) / 100) * $(window).width()) + "px");
		/*******************
		homeScreen2
		*******************/
		if (scrolledPercent >= 32) {
			$("#homeScreen2").css("margin-top", 0 - 2000 * (getLocalPercent(32, 40) / 100) + "px");
		}
		/*******************
		homeScreen3
		*******************/
		$("#homeScreen3").css("opacity", 0 + getLocalPercent(31, 32) / 100);
		// max : $(window).height() min : parseInt($("#homeMainSquare").css("top")) - parseInt($("#homeScreen3").css("top")
		$("#homeScreen3").css("margin-top", Math.floor(parseInt($("#homeMainSquare").css("top")) - parseInt($("#homeScreen3").css("top")) + ((1 - getLocalPercent(22, 26) / 100) * $(window).height()))  + "px");
		/*******************
		homeMainSquare - 2
		*******************/
		// de ($(window).width() / 2 - $("#homeMainSquare").width() / 2 + 50) a ($(window).width() / 2 - $("#homeMainSquare").width() / 2) + 2%
		$("#homeMainSquare").css("left", ($("#homeImgSuitedLine").offset().left + $("#homeImgSuitedLine").width() / 2 - $("#homeMainSquare").width() / 2) + ((getLocalPercent(27, 29) / 100) * 100) + "px");
		/*******************
		homeMainSquare - 3
		*******************/
		$("#homeMainSquare").css("left", "-=" + ((getLocalPercent(29.5, 31.5) / 100) * 200) + "px");
		/*******************
		homeMainSquare - 4
		*******************/
		$("#homeMainSquare").css("left", "+=" + ((getLocalPercent(32, 34) / 100) * 100) + "px");
		/*******************
		homeScreen3 p
		*******************/
		$("#homeScreen3 p").css("opacity", 1 - getLocalPercent(38, 40) / 100);
		/*******************
		homeScreen3 h2
		*******************/
		$("#homeScreen3 h2").css(browserPrefix + "transform", "perspective(500) rotateX(" + Math.floor(0 + (getLocalPercent(38, 40) / 100) * 90) + "deg)");
		/*******************
		homeScreen3 - 2
		*******************/
		$("#homeScreen3").css("opacity", 1 - getLocalPercent(38.5, 40) / 100);
		/*******************
		homeScreen3
		*******************/
		if (scrolledPercent >= 50.5) {
			$("#homeScreen2").css("margin-top", 0 - 2000 * (getLocalPercent(40, 46) / 100) + "px");
		}
		/*******************
		homeScreen4
		*******************/
		$("#homeScreen4").css("opacity", 0 + getLocalPercent(40, 40.1) / 100);
		// max : $(window).height() min : parseInt($("#homeMainSquare").css("top")) - parseInt($("#homeScreen3").css("top")
		$("#homeScreen4").css("margin-top", Math.floor(parseInt($("#homeMainSquare").css("top")) - parseInt($("#homeScreen4").css("top")) + ((1 - getLocalPercent(38.5, 39) / 100) * $(window).height()))  + "px");
		/*******************
		homeScreen4 p
		*******************/
		$("#homeScreen4 p").css("opacity", 0 + getLocalPercent(40, 42) / 100);
		/*******************
		homeScreen4 h2
		*******************/
		$("#homeScreen4 h2").css(browserPrefix + "transform", "perspective(500) rotateX(" + Math.floor(-90 - (getLocalPercent(40, 42) / 100) * -90) + "deg)");
		/*******************
		homeScreen4 homeImgSmartBulb
		*******************/
		$("#homeImgSmartBulb").css("opacity", 1 - getLocalPercent(42, 44) / 200);
		if (scrolledPercent >= 44) {
			$("#homeImgSmartBulb").css("opacity", 50 + getLocalPercent(44, 45) / 200);
		}
		if (scrolledPercent >= 45) {
			$("#homeImgSmartBulb").css("opacity", 1 - getLocalPercent(45, 46) / 200);
		}
		/*******************
		homeScreen4 p
		*******************/
		$("#homeScreen4 p").css("opacity", 1 - getLocalPercent(49, 51) / 100);
		/*******************
		homeScreen4 h2
		*******************/
		if (scrolledPercent >= 51) {
			$("#homeScreen4 h2").css(browserPrefix + "transform", "perspective(500) rotateX(" + Math.floor(0 + (getLocalPercent(51, 53) / 100) * 90) + "deg)");
		}
		/*******************
		homeScreen4 - 2
		*******************/
		if (scrolledPercent >= 51.5) {
			$("#homeScreen4").css("opacity", 1 - getLocalPercent(51.5, 53.5) / 100);
		}
		/*******************
		homeScreen4
		*******************/
		if (scrolledPercent >= 53.5) {
			$("#homeScreen4").css("margin-top", 0 - 2000 * (getLocalPercent(53.5, 60.5) / 100) + "px");
		}
		/*******************
		homeScreen5
		*******************/
		$("#homeScreen5").css("opacity", 0 + getLocalPercent(53, 53.1) / 100);
		$("#homeScreen5").css("margin-top", Math.floor(parseInt($("#homeMainSquare").css("top")) - parseInt($("#homeScreen5").css("top")) + ((1 - getLocalPercent(52, 53) / 100) * $(window).height()))  + "px");
		/*******************
		homeScreen5 p
		*******************/
		$("#homeScreen5 p").css("opacity", 0 + getLocalPercent(53, 55) / 100);
		/*******************
		homeScreen5 h2
		*******************/
		$("#homeScreen5 h2").css(browserPrefix + "transform", "perspective(500) rotateX(" + Math.floor(-90 - (getLocalPercent(53, 55) / 100) * -90) + "deg)");
		/*******************
		homeScreen5 homeImgHelpfulGearBig
		*******************/
		// 0 a 360
		$("#homeImgHelpfulGearBig").css(browserPrefix + "transform", "rotate(" + Math.floor(0 + (getLocalPercent(55, 61) / 100) * 360) + "deg)");
		/*******************
		homeScreen5 homeImgHelpfulGearSmall
		*******************/
		// 0 a 360
		$("#homeImgHelpfulGearSmall").css(browserPrefix + "transform", "rotate(" + Math.floor(0 + (getLocalPercent(55, 61) / 100) * 360) + "deg)");
		/*******************
		homeScreen5 homeImgHelpfulHeart
		*******************/
		$("#homeImgHelpfulHeart").css("opacity", 0 + getLocalPercent(54.5, 55) / 100);
		// scale
		$("#homeImgHelpfulHeart").css(browserPrefix + "transform", "scale(" + 0 + ((getLocalPercent(54.5, 60) / 100) * 1) + ")");
		// top de 0 a -40
		$("#homeImgHelpfulHeart").css("top", 0 - (getLocalPercent(55, 60) / 100) * 40);
		/*******************
		homeScreen5 - 2
		*******************/
		if (scrolledPercent >= 61) {
			$("#homeScreen5").css("opacity", 1 - getLocalPercent(61, 64) / 100);
		}
		/*******************
		homeScreen5
		*******************/
		if (scrolledPercent >= 64) {
			$("#homeScreen5").css("margin-top", 0 - 2000 * (getLocalPercent(64, 72) / 100) + "px");
		}
		/*******************
		homeMainSquare - 5
		*******************/
		if (scrolledPercent >= 61) {
			$("#homeMainSquare").css("opacity", 1 - getLocalPercent(61, 64) / 100);
		}
		/*******************
		homeScreen6
		*******************/
		$("#homeScreen6").css("opacity", 0 + getLocalPercent(63, 64) / 100);
		$("#homeScreen6").css("margin-top", $(window).height() - $(window).height() * (getLocalPercent(62.5, 63) / 100));
		/*******************
		homeAge homeAboutTitle
		*******************/
		$("#homeAge .homeAboutTitle").css("opacity", 0 + getLocalPercent(64, 65) / 100);
		/*******************
		homeAgeYearsNum
		*******************/
		$("#homeAgeYearsNum").css("opacity", 0 + getLocalPercent(65.5, 67.5) / 100);
		/*******************
		homeAgeYearsLab
		*******************/
		$("#homeAgeYearsLab").css("opacity", 0 + getLocalPercent(66.5, 68.5) / 100);
		/*******************
		homeAgeMonths
		*******************/
		$("#homeAgeMonths, #homeAgeMonths span").css("opacity", 0 + getLocalPercent(67, 69) / 100);
		/*******************
		homeAgeDays
		*******************/
		$("#homeAgeDays, #homeAgeDays span").css("opacity", 0 + getLocalPercent(67.5, 69.5) / 100);
		/*******************
		homeAgeBottom
		*******************/
		$("#homeAgeBottom, #homeAgeBottom span").css("opacity", 0 + getLocalPercent(68, 70) / 100);
		/*******************
		homeHob p
		*******************/
		$("#homeHob p").css("opacity", 0 + getLocalPercent(70, 71) / 100);
		/*******************
		homeHobImgVideoGames
		*******************/
		$("#homeHobImgVideoGames").css("opacity", 0 + getLocalPercent(71, 73) / 100);
		// scale
		$("#homeHobImgVideoGames").css(browserPrefix + "transform", "scale(" + 0 + ((getLocalPercent(71, 73) / 100) * 1) + ")");
		/*******************
		homeHobImgTennis
		*******************/
		$("#homeHobImgTennis").css("opacity", 0 + getLocalPercent(72, 74) / 100);
		// scale
		$("#homeHobImgTennis").css(browserPrefix + "transform", "scale(" + 0 + ((getLocalPercent(72, 74) / 100) * 1) + ")");
		/*******************
		homeHobImgDraw
		*******************/
		$("#homeHobImgDraw").css("opacity", 0 + getLocalPercent(73, 75) / 100);
		// scale
		$("#homeHobImgDraw").css(browserPrefix + "transform", "scale(" + 0 + ((getLocalPercent(73, 75) / 100) * 1) + ")");
		/*******************
		homeHobImgDev
		*******************/
		$("#homeHobImgDev").css("opacity", 0 + getLocalPercent(74, 76) / 100);
		// scale
		$("#homeHobImgDev").css(browserPrefix + "transform", "scale(" + 0 + ((getLocalPercent(74, 76) / 100) * 1) + ")");		
		/*******************
		homeQuote homeAboutTitle
		*******************/
		$("#homeQuote .homeAboutTitle").css("opacity", 0 + getLocalPercent(75, 76) / 100);
		/*******************
		homeQuote p
		*******************/
		$("#homeQuote p:not(.homeAboutTitle)").css("opacity", 0 + getLocalPercent(76, 77) / 100);
		/*******************
		homeAct homeAboutTitle
		*******************/
		$("#homeAct .homeAboutTitle").css("opacity", 0 + getLocalPercent(76, 77) / 100);
		/*******************
		homeActZombies
		*******************/
		$("#homeActZombies, #homeActZombies p").css("opacity", 0 + getLocalPercent(77, 78) / 100);
		// de -10 -height a -10
		$("#homeActZombies").css("bottom", -60 + (getLocalPercent(77, 79) / 100) * 50);
		/*******************
		homeActLearn
		*******************/
		$("#homeActLearn, #homeActLearn p").css("opacity", 0 + getLocalPercent(78, 79) / 100);
		// de -10 -height a -10
		$("#homeActLearn").css("bottom", -60 + (getLocalPercent(78, 80) / 100) * 190);
		/*******************
		homeActDesign
		*******************/
		$("#homeActDesign, #homeActDesign p").css("opacity", 0 + getLocalPercent(79, 80) / 100);
		// de -10 -height a -10
		$("#homeActDesign").css("bottom", -60 + (getLocalPercent(79, 81) / 100) * 290);
		/*******************
		homeActDev
		*******************/
		$("#homeActDev, #homeActDev p").css("opacity", 0 + getLocalPercent(80, 81) / 100);
		// de -10 -height a -10
		$("#homeActDev").css("bottom", -60 + (getLocalPercent(80, 82) / 100) * 370);
		/*******************
		homeActIllu
		*******************/
		$("#homeActIllu, #homeActIllu p").css("opacity", 0 + getLocalPercent(81, 82) / 100);
		// de -10 -height a -10
		$("#homeActIllu").css("bottom", -60 + (getLocalPercent(81, 83) / 100) * 415);
		/*******************
		homeScreen6
		*******************/
		//$("#homeScreen6").css("opacity", 1 - getLocalPercent(88, 89) / 100);
		$("#homeScreen6").css(browserPrefix + "transform", "perspective(800) rotateX(" + Math.floor(0 + (getLocalPercent(87, 89) / 100) * 45) + "deg)");
		$("#homeScreen6").css("margin-top", 0 - 200 * (getLocalPercent(87, 89) / 100) + "px");
		$("#homeScreen6").css("opacity", 1 - getLocalPercent(88.5, 89) / 100);
		/*******************
		homeScreen6
		*******************/
		if (scrolledPercent >= 89.5) {
			$("#homeScreen6").css("margin-top", 0 - 2000 * (getLocalPercent(89.5, 100) / 100) + "px");
		}
		/*******************
		homeScreen7
		*******************/
		//$("#homeScreen7").css("opacity", 0 + getLocalPercent(90, 90.5) / 100);

		$("#homeScreen7").css("margin-top", 250 + ($(window).height() - $(window).height() * (getLocalPercent(87.5, 87.9) / 100)));

		$("#homeScreen7").css(browserPrefix + "transform", "perspective(800) rotateX(" + Math.floor(-75 - (getLocalPercent(88, 90) / 100) * -75) + "deg)");
		if (scrolledPercent >= 88) {
			$("#homeScreen7").css("margin-top", 250 - (250 * (getLocalPercent(88, 90) / 100)));
		}
		$("#homeScreen7").css("opacity", 0 + getLocalPercent(88.2, 89) / 100);

		//$("#homeScreen7").css("margin-top", $(window).height() - $(window).height() * (getLocalPercent(89.5, 90) / 100));
	};

	function getLocalPercent (startAtPercent, endAtPercent) {
		var min = 0,
				max = 0,
				result = 0;

				min = ($(document).height() / 100) * startAtPercent;
				max = ($(document).height() / 100) * endAtPercent;

				result = ((scrolledValue - min) / (max - min)) * 100;
				if (result <= 0) {
					result = 0;
				} else if (result >= 100) {
					result = 100;
				}

		return result;
	};

	function resizeBubbles () {
		var containerW = $("#content").width(),
				mainRatio = 10;

				$("#homeHobImgVideoGames").css("width", Math.floor(containerW / (mainRatio / 1.2)) + "px");
				$("#homeHobImgVideoGames").css("height", $("#homeHobImgVideoGames").css("width"));

				$("#homeHobImgTennis").css("width", Math.floor(containerW / (mainRatio / 1.5)) + "px");
				$("#homeHobImgTennis").css("height", $("#homeHobImgTennis").css("width"));

				$("#homeHobImgDraw").css("width", Math.floor(containerW / (mainRatio / 1.7)) + "px");
				$("#homeHobImgDraw").css("height", $("#homeHobImgDraw").css("width"));

				$("#homeHobImgDev").css("width", Math.floor(containerW / (mainRatio / 1.95)) + "px");
				$("#homeHobImgDev").css("height", $("#homeHobImgDev").css("width"));

	};

	function resizeText () {
		var containerW = $("#content").width(),
				// Main title
				mainRatio = 9.5,
				subRation = 7.5,
				// Screen title
				stMainRatio = 7.2,
				stSubRatio = 16,
				// Age main
				ageMainRatio = 5.9,
				// Age right
				ageRightRatio = 25,
				// Age bottom
				ageBottomRatio = 39;
		
		// Main title
		$("#homeTitle1").css("font-size", Math.floor(containerW / mainRatio) + "px");
		$("#homeTitle1 .grey").css("font-size", Math.floor(containerW / subRation) + "px");
		$("#homeTitle1").css("line-height", Math.floor(containerW / mainRatio) + "px");

		// First screen title
		$(".screenTitle").css("font-size", Math.floor(containerW / stMainRatio) + "px");
		$(".screenTitle .grey").css("font-size", Math.floor(containerW / stSubRatio) + "px");
		$(".screenTitle").css("line-height", Math.floor(containerW / stMainRatio) + "px");

		// Age main
		$("#homeAgeYearsNum").css("font-size", Math.floor(containerW / ageMainRatio) + "px");
		$("#homeAgeYearsNum").css("top", Math.floor(containerW / (ageMainRatio * 2)) + "px");
		// Age right
		$("#homeAgeRight").css("font-size", Math.floor(containerW / ageRightRatio) + "px");
		$("#homeAgeRight").css("line-height", Math.floor(containerW / (ageRightRatio / 1.1)) + "px");
		$("#homeAgeRight").css("top", Math.floor(containerW / ageRightRatio) + "px");
		// Age bottom
		$("#homeAgeBottom").css("font-size", Math.floor(containerW / ageBottomRatio) + "px");
		$("#homeAgeBottom").css("top", Math.floor(containerW / (ageBottomRatio / 7)) + "px");

	}
	
	init();

});