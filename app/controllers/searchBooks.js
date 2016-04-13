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

var testLabel = Ti.UI.createView({
	backgroundColor: '#f00',
	font: { fontsize: 48 },
	text: "TOEIC(R)",
	color: '#0f0',
	width: 100,
	height: 100,
	right: 50,
	top: 200,
});

$.mainWin.add(testLabel);
