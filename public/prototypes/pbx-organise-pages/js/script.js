/* Author:

*/
$(document).ready(function() {
	window.pbxpcui = (function($, window, undefined){
		var document = window.document,
			navigator = window.navigator,
			location = window.location,
			// Prop
			_winHeight,
			_winWidth,
			_contentHeight,
			// Methods
			getLayoutDimensions = function() {
				_winHeight = $(window).height();
				_winWidth = $(window).width();
				_contentHeight = $(window).height() - ($("#mainHeader").height() + $("#subHeader").height());
			},
			mainLayout = function() {
				getLayoutDimensions();
				$("#container").css("height", _winHeight);
				$("#contentArea").css("height", _contentHeight);
			},
			getWinHeight = function() {
				getLayoutDimensions();
				return _winHeight;
			},
			getWinWidth = function() {
				getLayoutDimensions();
				return _winWidth;
			},
			getContentHeight = function() {
				getLayoutDimensions();
				return _contentHeight;
			};

		// Listeners
		$(window).resize(function() {
			mainLayout();
		});

		// Initial layout
		mainLayout();
			
		return {
			winHeight: getWinHeight,
			winWidth: getWinWidth,
			contentHeight: getContentHeight
		};	
	})(jQuery, window);
});