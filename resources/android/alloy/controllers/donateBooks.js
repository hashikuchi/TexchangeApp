function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function pixelsToDPUnits(pixel) {
        return pixel / (Titanium.Platform.displayCaps.dpi / 160);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "donateBooks";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.mainWin = Ti.UI.createWindow({
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        viewShadowColor: "black",
        opacity: 1,
        id: "mainWin"
    });
    $.__views.mainWin && $.addTopLevelView($.__views.mainWin);
    $.__views.__alloyId0 = Ti.UI.createLabel({
        text: "donate",
        id: "__alloyId0"
    });
    $.__views.mainWin.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.mainWin.add(Alloy.Globals.createCommonHeader());
    var screenWidth = 322;
    var needToChangeSize = false;
    var screenWidthActual = Ti.Platform.displayCaps.platformWidth;
    if (screenWidthActual >= 641) {
        screenWidth = screenWidthActual;
        needToChangeSize = true;
    }
    var win = $.mainWin;
    var backButton = Ti.UI.createButton({
        bottom: "20dp",
        height: "40dp",
        width: "200dp"
    });
    var prevMonth = Ti.UI.createButton({
        left: "15dp",
        width: "auto",
        height: "auto",
        title: "<",
        enabled: "true"
    });
    var nextMonth = Ti.UI.createButton({
        right: "15dp",
        width: "auto",
        height: "auto",
        title: ">",
        enabled: "true"
    });
    var monthTitle = Ti.UI.createLabel({
        top: "7dp",
        width: "200dp",
        height: "40dp",
        textAlign: "center",
        color: "#3a4756",
        font: {
            fontSize: 20,
            fontWeight: "bold"
        }
    });
    var toolBar = Ti.UI.createView({
        top: "70dp",
        width: "322dp",
        height: "80dp",
        backgroundColor: "#FFFFD800",
        layout: "vertical"
    });
    var toolBarTitle = Ti.UI.createView({
        top: "7dp",
        width: "322dp",
        height: "50dp"
    });
    toolBarTitle.add(prevMonth);
    toolBarTitle.add(monthTitle);
    toolBarTitle.add(nextMonth);
    var toolBarDays = Ti.UI.createView({
        height: "20dp",
        top: "0dp",
        width: "322dp",
        layout: "horizontal",
        left: "-1dp"
    });
    toolBarDays.sunday = Ti.UI.createLabel({
        left: "0dp",
        height: "20dp",
        text: "Sun",
        width: "46dp",
        textAlign: "center",
        font: {
            fontSize: 12,
            fontWeight: "bold"
        },
        color: "#3a4756"
    });
    toolBarDays.monday = Ti.UI.createLabel({
        left: "0dp",
        height: "20dp",
        text: "Mon",
        width: "46dp",
        textAlign: "center",
        font: {
            fontSize: 12,
            fontWeight: "bold"
        },
        color: "#3a4756"
    });
    toolBarDays.tuesday = Ti.UI.createLabel({
        left: "0dp",
        height: "20dp",
        text: "Tue",
        width: "46dp",
        textAlign: "center",
        font: {
            fontSize: 12,
            fontWeight: "bold"
        },
        color: "#3a4756"
    });
    toolBarDays.wednesday = Ti.UI.createLabel({
        left: "0dp",
        height: "20dp",
        text: "Wed",
        width: "46dp",
        textAlign: "center",
        font: {
            fontSize: 12,
            fontWeight: "bold"
        },
        color: "#3a4756"
    });
    toolBarDays.thursday = Ti.UI.createLabel({
        left: "0dp",
        height: "20dp",
        text: "Thu",
        width: "46dp",
        textAlign: "center",
        font: {
            fontSize: 12,
            fontWeight: "bold"
        },
        color: "#3a4756"
    });
    toolBarDays.friday = Ti.UI.createLabel({
        left: "0dp",
        height: "20dp",
        text: "Fri",
        width: "46dp",
        textAlign: "center",
        font: {
            fontSize: 12,
            fontWeight: "bold"
        },
        color: "#3a4756"
    });
    toolBarDays.saturday = Ti.UI.createLabel({
        left: "0dp",
        height: "20dp",
        text: "Sat",
        width: "46dp",
        textAlign: "center",
        font: {
            fontSize: 12,
            fontWeight: "bold"
        },
        color: "#3a4756"
    });
    toolBarDays.add(toolBarDays.sunday);
    toolBarDays.add(toolBarDays.monday);
    toolBarDays.add(toolBarDays.tuesday);
    toolBarDays.add(toolBarDays.wednesday);
    toolBarDays.add(toolBarDays.thursday);
    toolBarDays.add(toolBarDays.friday);
    toolBarDays.add(toolBarDays.saturday);
    toolBar.add(toolBarTitle);
    toolBar.add(toolBarDays);
    dayView = function(e) {
        var label = Ti.UI.createLabel({
            current: e.current,
            width: "46dp",
            height: "44dp",
            backgroundColor: "#FFDCDCDF",
            text: e.day,
            textAlign: "center",
            color: e.color,
            font: {
                fontSize: 20,
                fontWeight: "bold"
            }
        });
        return label;
    };
    monthName = function(e) {
        switch (e) {
          case 0:
            e = "January";
            break;

          case 1:
            e = "February";
            break;

          case 2:
            e = "March";
            break;

          case 3:
            e = "April";
            break;

          case 4:
            e = "May";
            break;

          case 5:
            e = "June";
            break;

          case 6:
            e = "July";
            break;

          case 7:
            e = "August";
            break;

          case 8:
            e = "September";
            break;

          case 9:
            e = "October";
            break;

          case 10:
            e = "November";
            break;

          case 11:
            e = "December";
        }
        return e;
    };
    var calView = function(a, b, c) {
        var nameOfMonth = monthName(b);
        var mainView = Ti.UI.createView({
            layout: "horizontal",
            width: "322dp",
            height: "auto",
            top: "150dp"
        });
        var daysInMonth = 32 - new Date(a, b, 32).getDate();
        var dayOfMonth = new Date(a, b, c).getDate();
        var dayOfWeek = new Date(a, b, 1).getDay();
        var daysInLastMonth = 32 - new Date(a, b - 1, 32).getDate();
        var daysInNextMonth = new Date(a, b, daysInMonth).getDay() - 6;
        var dayNumber = daysInLastMonth - dayOfWeek + 1;
        for (i = 0; dayOfWeek > i; i++) {
            mainView.add(new dayView({
                day: dayNumber,
                color: "#8e959f",
                current: "no",
                dayOfMonth: ""
            }));
            dayNumber++;
        }
        dayNumber = 1;
        for (i = 0; daysInMonth > i; i++) {
            var newDay = new dayView({
                day: dayNumber,
                color: "#3a4756",
                current: "yes",
                dayOfMonth: dayOfMonth
            });
            mainView.add(newDay);
            if (newDay.text == dayOfMonth) {
                newDay.color = "white";
                newDay.backgroundColor = "#FFFFF000";
                var oldDay = newDay;
            }
            dayNumber++;
        }
        dayNumber = 1;
        for (i = 0; i > daysInNextMonth; i--) {
            mainView.add(new dayView({
                day: dayNumber,
                color: "#8e959f",
                current: "no",
                dayOfMonth: ""
            }));
            dayNumber++;
        }
        mainView.addEventListener("click", function(e) {
            if ("yes" == e.source.current) {
                if (oldDay.text == dayOfMonth) {
                    oldDay.color = "white";
                    oldDay.backgroundColor = "#FFFFF000";
                } else {
                    oldDay.color = "#3a4756";
                    oldDay.backgroundColor = "#FFDCDCDF";
                }
                oldDay.backgroundPaddingLeft = "0dp";
                oldDay.backgroundPaddingBottom = "0dp";
                backButton.title = nameOfMonth + " " + e.source.text + ", " + a;
                e.source.backgroundColor = e.source.text == dayOfMonth ? "#FFFF00FF" : "#FFFF0000";
                e.source.backgroundPaddingLeft = "1dp";
                e.source.backgroundPaddingBottom = "1dp";
                e.source.color = "white";
                oldDay = e.source;
            }
        });
        return mainView;
    };
    var setDate = new Date();
    a = setDate.getFullYear();
    b = setDate.getMonth();
    c = setDate.getDate();
    var prevCalendarView = null;
    prevCalendarView = 0 == b ? calView(a - 1, 11, c) : calView(a, b - 1, c);
    prevCalendarView.left = -1 * screenWidth + "dp";
    var nextCalendarView = null;
    nextCalendarView = 0 == b ? calView(a + 1, 0, c) : calView(a, b + 1, c);
    nextCalendarView.left = screenWidth + "dp";
    var thisCalendarView = calView(a, b, c);
    false == needToChangeSize && (thisCalendarView.left = "-1dp");
    monthTitle.text = monthName(b) + " " + a;
    backButton.title = monthName(b) + " " + c + ", " + a;
    win.add(toolBar);
    win.add(thisCalendarView);
    win.add(nextCalendarView);
    win.add(prevCalendarView);
    win.add(backButton);
    var slideNext = Titanium.UI.createAnimation({
        duration: 500
    });
    slideNext.left = -1 * screenWidth;
    var slideReset = Titanium.UI.createAnimation({
        duration: 500
    });
    slideReset.left = false == needToChangeSize ? "-1" : (pixelsToDPUnits(screenWidthActual) - 322) / 2;
    var slidePrev = Titanium.UI.createAnimation({
        duration: 500
    });
    slidePrev.left = screenWidth;
    nextMonth.addEventListener("click", function() {
        if (11 == b) {
            b = 0;
            a++;
        } else b++;
        nextMonth.enabled = "false";
        thisCalendarView.animate(slideNext);
        nextCalendarView.animate(slideReset);
        setTimeout(function() {
            thisCalendarView.left = -1 * screenWidth + "dp";
            nextCalendarView.left = false == needToChangeSize ? "-1dp" : (screenWidth - 644) / 2;
            prevCalendarView = thisCalendarView;
            thisCalendarView = nextCalendarView;
            nextCalendarView = 11 == b ? calView(a + 1, 0, c) : calView(a, b + 1, c);
            monthTitle.text = monthName(b) + " " + a;
            nextCalendarView.left = screenWidth + "dp";
            win.add(nextCalendarView);
        }, 500);
        setTimeout(function() {
            nextMonth.enabled = "true";
        }, 1e3);
    });
    prevMonth.addEventListener("click", function() {
        if (0 == b) {
            b = 11;
            a--;
        } else b--;
        prevMonth.enabled = "false";
        thisCalendarView.animate(slidePrev);
        prevCalendarView.animate(slideReset);
        setTimeout(function() {
            thisCalendarView.left = screenWidth + "dp";
            if (false == needToChangeSize) prevCalendarView.left = "-1dp"; else {
                prevCalendarView.left = "-1dp";
                prevCalendarView.left = (screenWidth - 644) / 2;
            }
            nextCalendarView = thisCalendarView;
            thisCalendarView = prevCalendarView;
            prevCalendarView = 0 == b ? calView(a - 1, 11, c) : calView(a, b - 1, c);
            monthTitle.text = monthName(b) + " " + a;
            prevCalendarView.left = -1 * screenWidth + "dp";
            win.add(prevCalendarView);
        }, 500);
        setTimeout(function() {
            prevMonth.enabled = "true";
        }, 1e3);
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;