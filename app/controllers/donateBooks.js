/* Reference: http://stackoverflow.com/questions/9312717/create-calendar-with-events-appcelerator-titanium */
/* Problems */
// Change the message below
// Think carefully about the color and layout

$.mainWin.add(Alloy.Globals.createCommonHeader());

// module: get bookfair information by ajax
function getBookfairInfo(y, m, d)
{
    var url = 'http://beak.sakura.ne.jp/texchg_test2/wp-admin/admin-ajax.php';
    var giveMeInfoClient = Ti.Network.createHTTPClient();

    giveMeInfoClient.onload
	=  function(e)
    {
	var res = this.responseText; // response
	if (!res)
	{
	    alert("No response found...");
	    return;
	}
	Ti.API.info("The response is " + res);
	var jsRes = JSON.parse(res); // convert to a JS object

	Ti.API.info("a => " + y + ", b => " + m + ", c => " + d);

	// the year of bookfair
	var byear = new Array();
	for (var i = 0; i < 4; i++)
	{
	    byear[i] = jsRes[0].date[i];
	}
	byear = byear.join("");
	Ti.API.info("byear is " + byear);

	// the month of bookfair
	var bmonth = new Array();
	for (var i = 5; i < 7; i++)
	{
	    // when the month has only one digit
	    if (i == 5 && jsRes[0].date[5] == '0')
	    {
		bmonth[0] = jsRes[0].date[i + 1];
		break;
	    }
	    bmonth[i - 5] = jsRes[0].date[i];
	}
	bmonth = bmonth.join("");
	Ti.API.info("bmonth is " + bmonth);

	// the date of bookfair
	var bdate = new Array();
	for (var i = 8; i < 10; i++)
	{
	    // when the date has only one digit
	    if (i == 8 && jsRes[0].date[8] == '0')
	    {
		bdate[0] = jsRes[0].date[i + 1];
		break;
	    }
	    bdate[i - 8] = jsRes[0].date[i];
	}
	bdate = bdate.join("");
	Ti.API.info("bdate is " + bdate);

	if (byear == y && bmonth == m && bdate == d)
	{
	    backButton.title = "[古本市開催!]";
	}
	else
	{
	    backButton.title = monthName(m) + ' ' + d + ', ' + y;
	}	
    };

giveMeInfoClient.onerror
    = function(e) 
	{
            Ti.API.debug(e.error);
            // var errorDialog = Alloy.Globals.getConnectionErrorDialog();
            // errorDialog.addEventListener('click', function (e) {
	    // 	picker.startScanning();
	    // });
	};

    
    giveMeInfoClient.open('GET',
			  url + '?action=get_bookfair_info_of_all_by_ajax',
			  false);
    giveMeInfoClient.send();

    Ti.API.info(giveMeInfoClient);
    return giveMeInfoClient;
}

// taking Screen Width
var screenWidth = 322;
var needToChangeSize = false;

// taking the actual screen size
var screenWidthActual = Ti.Platform.displayCaps.platformWidth;

if (Ti.Platform.osname === 'android') {
    if (screenWidthActual >= 641) {
	screenWidth = screenWidthActual;
	needToChangeSize = true;
    }
}

// main Window of the Month View
var win = $.mainWin;

// Button at the buttom side
var backButton = Ti.UI.createButton({
    bottom : '20dp',
    height : '40dp',
    width : '200dp'
});

// Previous Button - Tool Bar
var prevMonth = Ti.UI.createButton({
//    top : 10,
    left : '15dp',
    width : 'auto',
    height : 'auto',
    title : '<',
    enabled: 'true'
});

// Next Button - Tool Bar
var nextMonth = Ti.UI.createButton({
    right : '15dp',
    width : 'auto',
    height : 'auto',
    title : '>',
    enabled: 'true'
});

// Month Title - Tool Bar
var monthTitle = Ti.UI.createLabel({
    //    top : '20dp',
    top: '7dp',
    width : '200dp',
    //    height : '24dp',
    height : '40dp',
    textAlign : 'center',
    color : '#3a4756',
    font : {
	fontSize : 20,
	fontWeight : 'bold'
    }
});

// Tool Bar
// Yellow zone which locates on the top.
var toolBar = Ti.UI.createView({
    //    top : '50dp',
    top: '70dp',
    width : '322dp',
    //    height : '50dp',
    height : '80dp',
    backgroundColor : '#FFFFD800',
    layout : 'vertical'
});

// Tool Bar - View which contain Title Prev. & Next Button
var toolBarTitle = Ti.UI.createView({
    top : '7dp',
    width : '322dp',
    //    height : '24dp'
    height : '50dp'
});

// Adding these labels to 'toolBarTitle'
toolBarTitle.add(prevMonth);
toolBarTitle.add(monthTitle);
toolBarTitle.add(nextMonth);

// Tool Bar - Day's like Sunday... Monday...
var toolBarDays = Ti.UI.createView({
    height: '20dp',
    top : '0dp',
    width : '322dp',
    //    height : '22dp',
    layout : 'horizontal',
    left : '-1dp'
});

toolBarDays.sunday = Ti.UI.createLabel({
    left : '0dp',
    height : '20dp',
    text : 'Sun',
    width : '46dp',
    textAlign : 'center',
    font : {
	fontSize : 12,
	fontWeight : 'bold'
    },
    color : '#3a4756'
});

toolBarDays.monday = Ti.UI.createLabel({
    left : '0dp',
    height : '20dp',
    text : 'Mon',
    width : '46dp',
    textAlign : 'center',
    font : {
	fontSize : 12,
	fontWeight : 'bold'
    },
    color : '#3a4756'
});

toolBarDays.tuesday = Ti.UI.createLabel({
    left : '0dp',
    height : '20dp',
    text : 'Tue',
    width : '46dp',
    textAlign : 'center',
    font : {
	fontSize : 12,
	fontWeight : 'bold'
    },
    color : '#3a4756'
});

toolBarDays.wednesday = Ti.UI.createLabel({
    left : '0dp',
    height : '20dp',
    text : 'Wed',
    width : '46dp',
    textAlign : 'center',
    font : {
	fontSize : 12,
	fontWeight : 'bold'
    },
    color : '#3a4756'
});

toolBarDays.thursday = Ti.UI.createLabel({
    left : '0dp',
    height : '20dp',
    text : 'Thu',
    width : '46dp',
    textAlign : 'center',
    font : {
	fontSize : 12,
	fontWeight : 'bold'
    },
    color : '#3a4756'
});

toolBarDays.friday = Ti.UI.createLabel({
    left : '0dp',
    height : '20dp',
    text : 'Fri',
    width : '46dp',
    textAlign : 'center',
    font : {
	fontSize : 12,
	fontWeight : 'bold'
    },
    color : '#3a4756'
});

toolBarDays.saturday = Ti.UI.createLabel({
    left : '0dp',
    height : '20dp',
    text : 'Sat',
    width : '46dp',
    textAlign : 'center',
    font : {
	fontSize : 12,
	fontWeight : 'bold'
    },
    color : '#3a4756'
});

toolBarDays.add(toolBarDays.sunday);
toolBarDays.add(toolBarDays.monday);
toolBarDays.add(toolBarDays.tuesday);
toolBarDays.add(toolBarDays.wednesday);
toolBarDays.add(toolBarDays.thursday);
toolBarDays.add(toolBarDays.friday);
toolBarDays.add(toolBarDays.saturday);

// Adding Tool Bar Title View & Tool Bar Days View
toolBar.add(toolBarTitle);
toolBar.add(toolBarDays);

// Function which create day view template. 1 - 31 days
dayView = function(e) {
    var label = Ti.UI.createLabel({
	current : e.current,
	width : '46dp',
	height : '44dp',
	backgroundColor : '#FFDCDCDF',
	text : e.day,
	textAlign : 'center',
	color : e.color,
	font : {
	    fontSize : 20,
	    fontWeight : 'bold'
	}
    });
    return label;
};

monthName = function(e) {
    switch(e) {
    case 0:
	e = 'January';
	break;
    case 1:
	e = 'February';
	break;
    case 2:
	e = 'March';
	break;
    case 3:
	e = 'April';
	break;
    case 4:
	e = 'May';
	break;
    case 5:
	e = 'June';
	break;
    case 6:
	e = 'July';
	break;
    case 7:
	e = 'August';
	break;
    case 8:
	e = 'September';
	break;
    case 9:
	e = 'October';
	break;
    case 10:
	e = 'November';
	break;
    case 11:
	e = 'December';
	break;
    };
    return e;
};

// Calendar Main Function
var calView = function(a, b, c)
{
    var nameOfMonth = monthName(b);

    // Create main calendar view
    var mainView = Ti.UI.createView
    ({
	layout : 'horizontal',
	width: '322dp',
	height : 'auto',
	//	top : '50dp'
	top : '150dp'
    });

    // set the time
    var daysInMonth = 32 - new Date(a, b, 32).getDate();
    var dayOfMonth = new Date(a, b, c).getDate();
    var dayOfWeek = new Date(a, b, 1).getDay();
    var daysInLastMonth = 32 - new Date(a, b - 1, 32).getDate();
    var daysInNextMonth = (new Date(a, b, daysInMonth).getDay()) - 6;

    // set initial day number
    var dayNumber = daysInLastMonth - dayOfWeek + 1;

    // get last month's days
    for ( i = 0; i < dayOfWeek; i++)
    {
	mainView.add(new dayView({
	    day : dayNumber,
	    color : '#8e959f',
	    current : 'no',
	    dayOfMonth : ''
	}));
	dayNumber++;
    };

    // reset day number for current month
    dayNumber = 1;

    // get this month's days
    for ( i = 0; i < daysInMonth; i++)
    {
	var newDay = new dayView
	({
	    day : dayNumber,
	    color : '#3a4756',
	    current : 'yes',
	    dayOfMonth : dayOfMonth
	});
	mainView.add(newDay);
	if (newDay.text == dayOfMonth)
	{
	    newDay.color = 'white';
	    newDay.backgroundColor = '#FFFFF000';
	    var oldDay = newDay;
	}
	dayNumber++;
    };
    dayNumber = 1;

    // get remaining month's days
    for ( i = 0; i > daysInNextMonth; i--)
    {
	mainView.add(new dayView({
	    day : dayNumber,
	    color : '#8e959f',
	    current : 'no',
	    dayOfMonth : ''
	}));
	dayNumber++;
    };

    // this is the new "clicker" function,
    // although it doesn't have a name anymore, it just is.
    mainView.addEventListener('click', function(e) {
	if (e.source.current == 'yes') {

	    // reset last day selected
	    if (oldDay.text == dayOfMonth) {
		oldDay.color = 'white';
		oldDay.backgroundColor = '#FFFFF000';
	    } else {
		oldDay.color = '#3a4756';
		oldDay.backgroundColor = '#FFDCDCDF'
	    }
	    oldDay.backgroundPaddingLeft = '0dp';
	    oldDay.backgroundPaddingBottom = '0dp';

	    // set window title with day selected, for testing purposes only
	    getBookfairInfo(a, b + 1, e.source.text);	    
	    //	    backButton.title = nameOfMonth + ' ' + e.source.text + ', ' + a;
	    Ti.API.info("e.source.text is " + e.source.text);

	    // set characteristic of the day selected
	    if (e.source.text == dayOfMonth) {
		e.source.backgroundColor = '#FFFF00FF';
	    } else {
		e.source.backgroundColor = '#FFFF0000';
	    }
	    e.source.backgroundPaddingLeft = '1dp';
	    e.source.backgroundPaddingBottom = '1dp';
	    e.source.color = 'white';
	    //this day becomes old :(
	    oldDay = e.source;
	}
    });

    return mainView;
};

// what's today's date?
var setDate = new Date();
a = setDate.getFullYear();
b = setDate.getMonth();
c = setDate.getDate();

// add the three calendar views to the window for changing calendars with animation later

var prevCalendarView = null;
if (b == 0) {
    prevCalendarView = calView(a - 1, 11, c);
} else {
    prevCalendarView = calView(a, b - 1, c);
}
prevCalendarView.left = (screenWidth * -1) + 'dp';

var nextCalendarView = null;
if (b == 0) {
    nextCalendarView = calView(a + 1, 0, c);
} else {
    nextCalendarView = calView(a, b + 1, c);
}
nextCalendarView.left = screenWidth + 'dp';

var thisCalendarView = calView(a, b, c);
if (needToChangeSize == false)
{
    thisCalendarView.left = '-1dp';
}

monthTitle.text = monthName(b) + ' ' + a;

// The text box which locates at the lower part.
// This is executed at the first time.
getBookfairInfo(a, b + 1, c);
// if (isFound)
// {
//     backButton.title = "[古本市開催!]";
// }
// else
// {
//     backButton.title = monthName(b) + ' ' + c + ', ' + a;
// }

// add everything to the window
win.add(toolBar);
win.add(thisCalendarView);
win.add(nextCalendarView);
win.add(prevCalendarView);
win.add(backButton);

// yeah, open the window, why not?
// win.open({
//     modal : true
// });

// the display width comes in pixel, so convert it to dpi
function pixelsToDPUnits(pixel)
{
    return (pixel / (Titanium.Platform.displayCaps.dpi / 160));
}

var slideNext = Titanium.UI.createAnimation({
    duration : 500
});

slideNext.left = (screenWidth * -1);

var slideReset = Titanium.UI.createAnimation({
    duration : 500
});

if (needToChangeSize == false) {
    slideReset.left = '-1';
} else {
    //    slideReset.left = ((screenWidth - 644) / 2);
    slideReset.left = (pixelsToDPUnits(screenWidthActual) - 322) / 2;
}

var slidePrev = Titanium.UI.createAnimation({
    duration : 500
});

// Locate calendar from 'screenWidth' dp left
// You mustn't modify this.
slidePrev.left = screenWidth;

// Next Month Click Event
nextMonth.addEventListener('click', function() {
    if (b == 11) {
	b = 0;
	a++;
    } else {
	b++;
    }

    nextMonth.enabled = 'false';

    thisCalendarView.animate(slideNext);
    nextCalendarView.animate(slideReset);

    setTimeout(function() {
	thisCalendarView.left = (screenWidth * -1) + 'dp';
	if (needToChangeSize == false) {
	    nextCalendarView.left = '-1dp';
	} else {
	    nextCalendarView.left = ((screenWidth - 644) / 2);
	}
	prevCalendarView = thisCalendarView;
	thisCalendarView = nextCalendarView;
	if (b == 11) {
	    nextCalendarView = calView(a + 1, 0, c);
	} else {
	    nextCalendarView = calView(a, b + 1, c);
	}
	monthTitle.text = monthName(b) + ' ' + a;
	nextCalendarView.left = screenWidth + 'dp';
	win.add(nextCalendarView);
    }, 500);

    // After one second, enable the button to be pushed
    setTimeout(function() {nextMonth.enabled = 'true'; }, 1000);    
    
});

// Previous Month Click Event
prevMonth.addEventListener('click', function() {
    if (b == 0) {
	b = 11;
	a--;
    } else {
	b--;
    }

    prevMonth.enabled = 'false';

    thisCalendarView.animate(slidePrev);
    prevCalendarView.animate(slideReset);
    
    setTimeout(function() {
	thisCalendarView.left = screenWidth + 'dp';
	if (needToChangeSize == false) {
	    prevCalendarView.left = '-1dp';
	} else {
	    prevCalendarView.left = '-1dp';
	    prevCalendarView.left = ((screenWidth - 644) / 2);
	}
	nextCalendarView = thisCalendarView;
	thisCalendarView = prevCalendarView;
	if (b == 0) {
	    prevCalendarView = calView(a - 1, 11, c);
	} else {
	    prevCalendarView = calView(a, b - 1, c);
	}
	monthTitle.text = monthName(b) + ' ' + a;
	prevCalendarView.left = (screenWidth * -1) + 'dp';
	win.add(prevCalendarView);
    }, 500);

    // After one second, enable the button to be pushed    
    setTimeout(function() {prevMonth.enabled = 'true'; }, 1000);

});
