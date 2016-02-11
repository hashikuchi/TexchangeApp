/* Problems */
// The month is overlapped by the iphone's menu
// Change the height of the place where shows month
// Change the message below
// Think carefully about the color and layout
// Improve the sensibility

$.mainWin.add(Alloy.Globals.createCommonHeader());

// Taking Screen Width
var screenWidth = 322;
var needToChangeSize = false;

var screenWidthActual = Ti.Platform.displayCaps.platformWidth;

if (Ti.Platform.osname === 'android') {
    if (screenWidthActual >= 641) {
	screenWidth = screenWidthActual;
	needToChangeSize = true;
    }
}

// Main Window of the Month View.
var win = Ti.UI.createWindow({
    backgroundColor : '#FFFFFF',
    /* If you change this, the position of something like base window
     * changes.
     */
    top : '50dp',
    navBarHidden : true
});

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
    title : '<'
});

// Next Button - Tool Bar
var nextMonth = Ti.UI.createButton({
    right : '15dp',
    width : 'auto',
    height : 'auto',
    title : '>'
});

// Month Title - Tool Bar
// I need to modify here!
var monthTitle = Ti.UI.createLabel({
    top : 4,
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
// but, the lower part of the string can't be seen.
// => This issue can't be solved?
var toolBar = Ti.UI.createView({
    top : '0dp',
    width : '322dp',
    //    height : '50dp',
    height : '70dp',
    backgroundColor : '#FFFFD800',
    layout : 'vertical'
});

// Tool Bar - View which contain Title Prev. & Next Button
// This enables to change the position of both buttons
// No, maybe this part has effects to the whole elements
var toolBarTitle = Ti.UI.createView({
    //top : '3dp',
    top : '3dp',
    width : '322dp',
    /* Change here!!! */
    //    height : '24dp'
    height : '40dp'
});

toolBarTitle.add(prevMonth);
toolBarTitle.add(monthTitle);
toolBarTitle.add(nextMonth);

/* Tool Bar - Day's like Sunday... Monday... */
var toolBarDays = Ti.UI.createView({
    //    top : '2dp',
    //    top : '15dp',
    top : '2dp',
    width : '322dp',
    height : '22dp',
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

// Function which create day view template
dayView = function(e) {
    var label = Ti.UI.createLabel({
	current : e.current,
	width : '46dp',
	height : '44dp',
	/* Spaces between the lines */
//	top : '20dp',
	// Is this color code correct?
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
var calView = function(a, b, c) {
    var nameOfMonth = monthName(b);

    //create main calendar view
    var mainView = Ti.UI.createView({
	layout : 'horizontal',
	width : '322dp',
	height : 'auto',
	/* Previous */
	//	top : '50dp'
	top : '70dp'
    });

    //set the time
    var daysInMonth = 32 - new Date(a, b, 32).getDate();
    var dayOfMonth = new Date(a, b, c).getDate();
    var dayOfWeek = new Date(a, b, 1).getDay();
    var daysInLastMonth = 32 - new Date(a, b - 1, 32).getDate();
    var daysInNextMonth = (new Date(a, b, daysInMonth).getDay()) - 6;

    //set initial day number
    var dayNumber = daysInLastMonth - dayOfWeek + 1;

    //get last month's days
    for ( i = 0; i < dayOfWeek; i++) {
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

    //get this month's days
    for ( i = 0; i < daysInMonth; i++) {
	var newDay = new dayView({
	    day : dayNumber,
	    color : '#3a4756',
	    current : 'yes',
	    dayOfMonth : dayOfMonth
	});
	mainView.add(newDay);
	if (newDay.text == dayOfMonth) {
	    newDay.color = 'white';
	    // newDay.backgroundImage='../libraries/calendar/pngs/monthdaytiletoday_selected.png';
	    newDay.backgroundColor = '#FFFFF000';
	    var oldDay = newDay;
	}
	dayNumber++;
    };
    dayNumber = 1;

    //get remaining month's days
    for ( i = 0; i > daysInNextMonth; i--) {
	mainView.add(new dayView({
	    day : dayNumber,
	    color : '#8e959f',
	    current : 'no',
	    dayOfMonth : ''
	}));
	dayNumber++;
    };

    // this is the new "clicker" function, although it doesn't have a name anymore, it just is.
    mainView.addEventListener('click', function(e) {
	if (e.source.current == 'yes') {

	    // reset last day selected
	    if (oldDay.text == dayOfMonth) {
		oldDay.color = 'white';
		// oldDay.backgroundImage='../libraries/calendar/pngs/monthdaytiletoday.png';
		oldDay.backgroundColor = '#FFFFF000';
	    } else {
		oldDay.color = '#3a4756';
		// oldDay.backgroundImage='../libraries/calendar/pngs/monthdaytile-Decoded.png';
		oldDay.backgroundColor = '#FFDCDCDF'
	    }
	    oldDay.backgroundPaddingLeft = '0dp';
	    oldDay.backgroundPaddingBottom = '0dp';

	    // set window title with day selected, for testing purposes only
	    backButton.title = nameOfMonth + ' ' + e.source.text + ', ' + a;

	    // set characteristic of the day selected
	    if (e.source.text == dayOfMonth) {
		// e.source.backgroundImage='../libraries/calendar/pngs/monthdaytiletoday_selected.png';
		e.source.backgroundColor = '#FFFF00FF';
	    } else {
		// e.source.backgroundImage='../libraries/calendar/pngs/monthdaytile_selected.png';
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
if (needToChangeSize == false) {
    thisCalendarView.left = '-1dp';
}

monthTitle.text = monthName(b) + ' ' + a;

backButton.title = monthName(b) + ' ' + c + ', ' + a;

// add everything to the window
win.add(toolBar);
win.add(thisCalendarView);
win.add(nextCalendarView);
win.add(prevCalendarView);
win.add(backButton);

// yeah, open the window, why not?
win.open({
    modal : true
});

var slideNext = Titanium.UI.createAnimation({
    // left : '-322',
    duration : 500
});

slideNext.left = (screenWidth * -1);

var slideReset = Titanium.UI.createAnimation({
    // left : '-1',
    duration : 500
});

if (needToChangeSize == false) {
    slideReset.left = '-1';
} else {
    slideReset.left = ((screenWidth - 644) / 2);
}

var slidePrev = Titanium.UI.createAnimation({
    // left : '322',
    duration : 500
});

slidePrev.left = screenWidth;

// Next Month Click Event
// I need to change here because of the severe sensisensibility
nextMonth.addEventListener('click', function() {
    if (b == 11) {
	b = 0;
	a++;
    } else {
	b++;
    }

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
});

// Previous Month Click Event
prevMonth.addEventListener('click', function() {
    if (b == 0) {
	b = 11;
	a--;
    } else {
	b--;
    }
    thisCalendarView.animate(slidePrev);
    prevCalendarView.animate(slideReset);
    setTimeout(function() {
	thisCalendarView.left = screenWidth + 'dp';
	if (needToChangeSize == false) {
	    prevCalendarView.left = '-1dp';
	} else {
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
});
