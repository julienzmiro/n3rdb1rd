/* Author: 

*/
/*Shadowbox.init({
    viewportPadding: 5,
    overlayOpacity: 0.8
});*/
/*
$(document).ready(function(){

	var blinkHomeTxt = function() {
		var counter = 1,
				interval;

		interval = window.setInterval(function() {
			$(".txtIntroBlink").css("display", "none");
			$("#txtIntroBlink" + counter).css("display", "inline");
			if (counter < 5) {
				counter ++;	
			}
			else {
				counter = 1;
			}
		}, 1300);
	};

	blinkHomeTxt();

	
	console.log("READY");
	$("#container").click(function(e){
		console.log("CLICK");
		$.ajax({
	    url: "/journal-ajax",
	    type: "GET",
	    dataType: "json",
	    contentType: "application/json",
	    cache: false,
	    timeout: 5000,
	    complete: function() {
	      console.log('process complete');
	    },
	    success: function(data) {
	      console.log(data);
	      $('#content').html(data);
	      console.log('process sucess');
	   	},
	    error: function() {
	      console.log('process error');
	    },
	  });
	});
});
*/