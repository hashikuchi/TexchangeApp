var args = arguments[0] || {};
var data = args.data || '{}'; //検索結果JSON
var glassIcon = Ti.UI.createImageView({
	image: "/images/glass.png",
	right: 30,
	top: 25,
	height: "30%"
});

glassIcon.addEventListener("touchend", function(e){
	var searchMenu = Alloy.createController("search/searchMenu").getView();
	searchMenu.open();
});

$.mainWin.add(Alloy.Globals.createCommonHeader([glassIcon]));

Ti.API.info(data);
