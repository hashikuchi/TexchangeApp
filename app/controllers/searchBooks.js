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

Ti.API.info(data)
var parsedData = JSON.parse(data);
Ti.API.info(parsedData);

var imgURL = new Array(parsedData.length); // thumbnail urls
var j = 0;
for (var i = 0; i < parsedData.length; i++)
{
    var giveMeImgURLClient = Ti.Network.createHTTPClient();

    // can't guarantee the order...
    giveMeImgURLClient.onload
	=  function(e)
    {
	// urls of book images
	var res = this.responseText;
	Ti.API.info("res = " + res);

	if (!res)
	{
	    alert("データを取得できませんでした");
	    return;
	}
	else
	{
	    imgURL[j] = res;
	}
	
	if (j == parsedData.length - 1) // if the last element comes
	{
	    Ti.API.info("the last element!");
	    listBooks(imgURL);
	}
	j += 1;
    };

    giveMeImgURLClient.onerror
	= function(e)
    {
	alert("通信エラー");
	Ti.API.debug(e.error);
    };

    Ti.API.info("parsedData[" + i + "].ID = " + parsedData[i].ID);
    giveMeImgURLClient.open('POST', Alloy.Globals.ajaxUrl);
    giveMeImgURLClient.send({
	action: "echo_thumbnail_url",
	post_id: parsedData[i].ID,
    });
}

// the display width comes in pixel, so convert it to dpi
function pixelsToDPUnits(pixel)
{
    return (pixel / (Titanium.Platform.displayCaps.dpi / 160));
}

function listBooks(iu)
{
    var screenWidthActual = pixelsToDPUnits(Ti.Platform.displayCaps.platformWidth);
    var screenHeightActual = pixelsToDPUnits(Ti.Platform.displayCaps.platformHeight);

    var properTop = screenHeightActual / 4 - 50;
    
    for (var i = 0; i < iu.length; i++)
    {
	Ti.API.info(parsedData[i].post_title);
	if (i % 2 == 0)
	{
	    var thumbnail = Ti.UI.createImageView({
		image: iu[i],
		width: '110px',
		height: '160px',
		left: '20%',
		top: properTop,
	    });
	    var title = Ti.UI.createLabel({
		color: '#00A935',
		width: '40%',
		height: '30%',
		left: '10%',
		top: properTop + 50,
		font: { fontsize: 5, fontFamily: 'Helvetica Neue' },
		text: parsedData[i].post_title,
	    });
	}
	else
	{
	    var thumbnail = Ti.UI.createImageView({
		image: iu[i],
		right: '20%',
		top: properTop,
	    });
	    var title = Ti.UI.createLabel({
		color: '#00A935',
		width: '40%',
		height: '30%',
		left: screenWidthActual * 3 / 4 - 55,
		top: properTop + 50,
		font: { fontsize: 5, fontFamily: 'Helvetica Neue' },
		text: parsedData[i].post_title,
	    });
	    properTop += screenHeightActual / 3;
	}

	$.mainWin.add(thumbnail);
	$.mainWin.add(title);
    }
}
