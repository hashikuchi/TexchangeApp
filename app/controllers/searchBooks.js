var args = arguments[0] || {};
var data = args.data || '{}'; //検索結果JSON
var searchCondition = args.searchCondition || '';
var headerItems = [];
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
headerItems.push(glassIcon);

if(searchCondition){
	var conditionLabel = Ti.UI.createLabel({
		top: 20,
		left: '20%',
		width: '60%',
		color: '#000000',
		text: '検索条件: ' + searchCondition
	});
	headerItems.push(conditionLabel);
}
 
$.mainWin.add(Alloy.Globals.createCommonHeader(headerItems));

var screenWidthActual = pixelsToDPUnits(Ti.Platform.displayCaps.platformWidth);
var screenHeightActual = pixelsToDPUnits(Ti.Platform.displayCaps.platformHeight);
var properTop = screenHeightActual / 20;

var scrollView = Ti.UI.createScrollView({
    top: 70, // this should be changed
    showVerticalScrollIndicator: true,
    showHorizontalScrollIndicator: true,
});
$.mainWin.add(scrollView);

var parsedData = JSON.parse(data);
if(parsedData.length >= 50) {
	parsedData = parsedData.slice(0, 49);
}

for (var i = 0; i < parsedData.length; i++) {
	listBooks(i, parsedData[i]);
}

// the display width comes in pixel, so convert it to dpi
function pixelsToDPUnits(pixel) {
    return (pixel / (Titanium.Platform.displayCaps.dpi / 160));
}

function limitCharNum(pt) {
    var new_post_title = '';
    for (var i = 0; i < 19; i++) {
		if (i == pt.length) break;
		new_post_title += pt[i];	
		if (i == 18) new_post_title += '...';
    }
    return new_post_title;
}

function listBooks(num, book) {
    if (num % 2 == 0) {
		var txt = limitCharNum(book.post_title);
		var thumbnail = Ti.UI.createImageView({
	  	  	image: book.image_url,
	   	 	width: pixelsToDPUnits(110),
	   		height: pixelsToDPUnits(160),
	   	 	left: (screenWidthActual - (pixelsToDPUnits(110) * 2)) / 3,
	    	top: properTop,
		});
		var title = Ti.UI.createLabel({
	    	width: screenWidthActual * 30 / 100,
	    	height: '56dp',
	    	left: (screenWidthActual - (pixelsToDPUnits(110) * 2)) / 3
			- screenWidthActual * 15 / 100 + pixelsToDPUnits(55),
	    	top: properTop + pixelsToDPUnits(160),

	    	color: '#00A935',	    
	    	font: { fontsize: 5, fontFamily: 'Helvetica Neue' },
	    	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	    	verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
	    	text: txt,
		});
    } else {
    	var txt = limitCharNum(book.post_title);
		var thumbnail = Ti.UI.createImageView({
	    	image: book.image_url,
	    	width: '110px',
	    	height: '160px',
	    	left: ((screenWidthActual - (pixelsToDPUnits(110) * 2)) / 3) * 2
			+ pixelsToDPUnits(110),
	    	top: properTop
		});
		var title = Ti.UI.createLabel({
	    	color: '#00A935',
	    	width: screenWidthActual * 30 / 100,
	    	height: '56dp',
	    	left: ((screenWidthActual - (pixelsToDPUnits(110) * 2)) / 3) * 2
			+ pixelsToDPUnits(110) - screenWidthActual * 15 / 100
			+ pixelsToDPUnits(55),
	    	top: properTop + pixelsToDPUnits(160),
	    	font: { fontsize: 5, fontFamily: 'Helvetica Neue' },
	    	textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	    	verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
	    	text: txt,
		});
		properTop += screenHeightActual / 3;
    }
	thumbnail.addEventListener('click', function(e){
		openBookPage({
			title: book.post_title,
			author: book.author,
			category: book.category[0].name,
			image_url: book.image_url,
			price: book.price,
			count: book.book_count
		});
	});
	title.addEventListener('click', function(e){
		openBookPage({
			title: book.post_title,
			author: book.author,
			category: book.category[0].name,
			image_url: book.image_url,
			price: book.price,
			count: book.book_count
		});
	});
    scrollView.add(thumbnail);
    scrollView.add(title);
}

function openBookPage(args){
	var itemWin = Alloy.createController('book', {
		title: args.title,
		image_url: args.image_url,
		author: args.author,
		category: args.category,
		price: args.price,
		count: args.count
	}).getView();
	itemWin.open();
}
