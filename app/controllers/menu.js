var menus = ["searchBooks", "donateBooks"];
var menuWindows = [];

for(var i=0, len=menus.length; i<len; i++){
	var win = Alloy.createController(menus[i]).getView();
	win.left = "80%";
	menuWindows[menus[i]] = win;
}

var searchBooksWindow = Alloy.createController('searchBooks').getView();

// open each function screen
$.menuTable.addEventListener("singletap", function(e){
	if(e.row){
		var animation = Ti.UI.createAnimation({
			duration: 200,
			right: "100%",
			left: "-60%"
		});
		$.menuTable.animate(animation, function(){
			var id = e.row.id;
			var win = menuWindows[id];
			win.open();
			$.menuWin.close();
		});	
	}
});


/**
 * horizontal scroll action
 */
var touchBeginX = 0;

$.menuWin.addEventListener("touchstart", function(e){
	// save the point touch started
	touchBeginX = e.x;
});

$.menuWin.addEventListener("touchend", function(e){
	var thresholdCloseMenu = $.menuTable.size.width * 0.4;
	if($.menuTable.left < -thresholdCloseMenu){
		// close the menu window
		$.menuTable.animate({
			duration: 200,
			right: "100%",
			left: "-60%"
		}, function(){$.menuWin.close();});
	}else{
		// put back the menu on the default position
		$.menuTable.animate({
			left: 0,
			duration: 100
		});	
	}
});

$.menuWin.addEventListener("touchmove", function(e){
	var type = e.source.toString();
	if(type.indexOf("TableView") != -1){
		// When the event was fired on the menu table view,
		// adjust the value of x then fire the event of the window.
		$.menuWin.fireEvent("touchmove",{
			x: e.x + $.menuTable.left,
			source: $.menuWin
		});
		return;
	}
	
	var x = e.x;
	var left = x - touchBeginX;
	if(left < 0){
		$.menuTable.animate({
			left: left,
			duration: 0
		});
	}
});