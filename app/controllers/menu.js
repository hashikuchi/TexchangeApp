var menus = ["searchBooks", "donateBooks"];
var menuWindows = [];

for(var i=0, len=menus.length; i<len; i++){
	var win = Alloy.createController(menus[i]).getView();
	win.left = "80%";
	menuWindows[menus[i]] = win;
}

var searchBooksWindow = Alloy.createController('searchBooks').getView();

$.menuTable.addEventListener("click", function(e){
	var animation = Ti.UI.createAnimation({
		duration: 200,
		left: 0
	});
	var id = e.row.id;
	var win = menuWindows[id];
	win.open();
	win.opened = true; // turn on the flag
	win.animate(animation);
});

// open default window
$.menuWin.addEventListener("open", function(){
	$.menuWin.visible = true;
	var defaultWin = menuWindows["searchBooks"];
	defaultWin.left = 0; // reset the position of default window
	defaultWin.open();
});