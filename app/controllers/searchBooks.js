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

var parsedData = JSON.parse(data);
Ti.API.info("the number of items = " + parsedData.length);

var imgURL = new Array(parsedData.length);
for (var i = 0; i < parsedData.length; i++)
{
    Ti.API.info("i = " + i);
    var giveMeImgURLClient = Ti.Network.createHTTPClient();

    Ti.API.info("2. i = " + i);
    giveMeImgURLClient.onload
	=  function(e)
    {
	i -= 1;
	
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
	    imgURL[i] = res;
	}
	Ti.API.info("i = " + i);
	if (i == 0) // if the last element comes
	{
	    Ti.API.info("the last element!");
	    listBooks(imgURL);
	}
    };

    giveMeImgURLClient.onerror
	= function(e)
    {
	alert("通信エラー");
	Ti.API.debug(e.error);
    };


    giveMeImgURLClient.open('POST', Alloy.Globals.ajaxUrl);
    giveMeImgURLClient.send({
	action: "echo_thumbnail_url",
	post_id: parsedData[i].ID,
    });
}

function listBooks(iu)
{
    // the display width comes in pixel, so convert it to dpi
    function pixelsToDPUnits(pixel)
    {
	return (pixel / (Titanium.Platform.displayCaps.dpi / 160));
    }
    var screenWidthActual = pixelsToDPUnits(Ti.Platform.displayCaps.platformWidth);

    Ti.API.info("iu[0] = " + iu[0]);
    var testImg = Ti.UI.createImageView({
	image: iu[0],
    });

    var testLabel = Ti.UI.createLabel({
	backgroundColor: '#f00',
	color: '#999',
	text: 'TOEIC(R) \u30c6\u30b9\u30c8 BEYOND 990 \u8d85\u4e0a\u7d1a\u30ea\u30fc\u30c7\u30a3\u30f3\u30b0 7\u3064\u306e\u30b3\u30a2\u30b9\u30ad\u30eb',
	font: { fontsize: 20, fontFamily: 'Helvetica Neue'},
	textAlign: 'center',
	width: '40%',
	height: '100px',
	left: '10%',
    });

    $.mainWin.add(testLabel);
    $.mainWin.add(testImg);
}
