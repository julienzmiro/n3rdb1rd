/* Author:

*/
$(document).ready(function() {
	var winHeight = $(window).height(),
		contentHeight = $(window).height() - ($("#mainHeader").height() + $("#subHeader").height()),
		intervalRolloverMenuCat,
		intervalRolloverMenuThemes,
		intervalRolloverBook;

	
	// Positions init
	$("#container").css("height", winHeight);
	$("#contentArea").css("height", contentHeight);
	$("#content").css("height", contentHeight);
	$("#menuThemes .menu").css("width", function() {
		var size = 195 * $(".menuThemeThumb").length;
		return size;
	});
	$("#menuCatPhotobox .menu").css("width", function() {
		var size = 95 * $(".menuCatThumb").length;
		return size;
	});
	$("#content .deco").offset(function(index, coords){
		//var newTop = coords.top,
		var newTop = ($(window).height() / 2) - ($("#content .deco").height() / 2),
		newLeft = ($(window).width() / 2) - ($("#content .deco").width() / 2);
		return {top: newTop, left: newLeft};
	});
	$("#content .book").offset(function(index, coords){
		//var newTop = coords.top,
		var newTop = ($(window).height() / 2) - ($("#content .book").height() / 2),
		newLeft = ($(window).width() / 2) - ($("#content .book").width() / 2);
		return {top: newTop, left: newLeft};
	});

	// Resize
	$(window).resize(function() {
		winHeight = $(window).height();
		contentHeight = $(window).height() - ($("#mainHeader").height() + $("#subHeader").height());
		$("#container").css("height", winHeight);
		$("#contentArea").css("height", contentHeight);
		$("#content").css("height", contentHeight);
		$("#content .deco").offset(function(index, coords){
			//var newTop = coords.top,
			var newTop = ($(window).height() / 2) - ($("#content .deco").height() / 2),
			newLeft = ($(window).width() / 2) - ($("#content .deco").width() / 2);
			return {top: newTop, left: newLeft};
		});
		$("#content .book").offset(function(index, coords){
			//var newTop = coords.top,
			var newTop = ($(window).height() / 2) - ($("#content .book").height() / 2),
			newLeft = ($(window).width() / 2) - ($("#content .book").width() / 2);
			return {top: newTop, left: newLeft};
		});
	});

	// Rollover book (l'image devra etre decouplee de la deco)
	$("#content .bookTest").mouseenter(function(e) {
		var index = 2;

		$("#content .bookTest").attr("src", "img/themes/baby-book-p2.png");

		intervalRolloverBook = window.setInterval(function() {
			$("#content .bookTest").attr("src", "img/themes/baby-book-p" + index + ".png");
			if(index < 3) {
				index += 1;	
			} else {
				index = 1;
			}
		}, 1200);
	});
	$("#content .bookTest").mouseleave(function(e) {
		window.clearInterval(intervalRolloverBook);
		$("#content .bookTest").attr("src", "img/themes/baby-book-p1.png");
	});

	// Carousel Cat
	// Au lieu de la valeur 20, on va fixer la vitesse en fonction de la position souris (coeff)
	/*
	de 0 (coeff = 1) à window.width / 4 (coeff = 0) => left
		coeff = 
		speed = coeff * 20
	de widow.width - (window.width / 4)(coeff = 1) à window.width (coeff = 0) => right
		coeff = (b - a) / 100
		speed = coeff * 20
	*/
	$("#menuCatPhotobox").mouseenter(function(e) {
		var posXMouse = e.pageX;

		$("#menuCatPhotobox").bind("mousemove", function(e) {
			posXMouse = e.pageX;
		});

		intervalRolloverMenuCat = window.setInterval(function() {
			if (posXMouse < ($(window).width() / 4) && $("#menuCatPhotobox .menu").offset().left < 0) {
				$("#menuCatPhotobox .menu").offset(function(index, coords) {
					var newTop = coords.top,
						newLeft = coords.left + 20;
					return {top: newTop, left: newLeft};
				});
			}
			if (posXMouse > ($(window).width() - ($(window).width() / 4)) && -$("#menuCatPhotobox .menu").offset().left < ($("#menuCatPhotobox .menu").width() - $(window).width())) {
				$("#menuCatPhotobox .menu").offset(function(index, coords) {
					var newTop = coords.top,
						newLeft = coords.left - 20;
					return {top: newTop, left: newLeft};
				});
			}
		}, 25);		

	});

	$("#menuCatPhotobox").mouseleave(function(e) {
		$("#menuCatPhotobox").unbind("move");
		window.clearInterval(intervalRolloverMenuCat);
	});

	// Carousel themes
	// Au lieu de la valeur 20, on va fixer la vitesse en fonction de la position souris (coeff)
	$("#menuThemes").mouseenter(function(e) {
		var posXMouse = e.pageX;

		$("#menuThemes").bind("mousemove", function(e) {
			posXMouse = e.pageX;
		});

		intervalRolloverMenuThemes = window.setInterval(function() {
			if (posXMouse < ($(window).width() / 4) && $("#menuThemes .menu").offset().left < 0) {
				$("#menuThemes .menu").offset(function(index, coords) {
					var newTop = coords.top,
						newLeft = coords.left + 20;
					return {top: newTop, left: newLeft};
				});
			}
			if (posXMouse > ($(window).width() - ($(window).width() / 4)) && -$("#menuThemes .menu").offset().left < ($("#menuThemes .menu").width() - $(window).width())) {
				$("#menuThemes .menu").offset(function(index, coords) {
					var newTop = coords.top,
						newLeft = coords.left - 20;
					return {top: newTop, left: newLeft};
				});
			}
		}, 25);		

	});

	$("#menuThemes").mouseleave(function(e) {
		$("#menuThemes").unbind("move");
		window.clearInterval(intervalRolloverMenuThemes);
	});
});