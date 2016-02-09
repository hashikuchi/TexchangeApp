function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId8() {
        $.__views.menuWin.removeEventListener("open", __alloyId8);
        if ($.__views.menuWin.activity) ; else {
            Ti.API.warn("You attempted to access an Activity on a lightweight Window or other");
            Ti.API.warn("UI component which does not have an Android activity. Android Activities");
            Ti.API.warn("are valid with only windows in TabGroups or heavyweight Windows.");
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "menu";
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
    $.__views.menuWin = Ti.UI.createWindow({
        id: "menuWin"
    });
    $.__views.menuWin && $.addTopLevelView($.__views.menuWin);
    $.__views.menuWin.addEventListener("open", __alloyId8);
    var __alloyId9 = [];
    $.__views.searchBooks = Ti.UI.createTableViewRow({
        title: "本を探す",
        id: "searchBooks"
    });
    __alloyId9.push($.__views.searchBooks);
    $.__views.donateBooks = Ti.UI.createTableViewRow({
        title: "本をあげる",
        id: "donateBooks"
    });
    __alloyId9.push($.__views.donateBooks);
    $.__views.menuTable = Ti.UI.createTableView({
        data: __alloyId9,
        id: "menuTable"
    });
    $.__views.menuWin.add($.__views.menuTable);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var menus = [ "searchBooks", "donateBooks" ];
    var menuWindows = [];
    for (var i = 0, len = menus.length; len > i; i++) {
        var win = Alloy.createController(menus[i]).getView();
        win.left = "80%";
        menuWindows[menus[i]] = win;
    }
    Alloy.createController("searchBooks").getView();
    $.menuTable.addEventListener("singletap", function(e) {
        if (e.row) {
            var animation = Ti.UI.createAnimation({
                duration: 200,
                right: "100%",
                left: "-60%"
            });
            $.menuTable.animate(animation, function() {
                var id = e.row.id;
                var win = menuWindows[id];
                win.open();
                $.menuWin.close();
            });
        }
    });
    var touchBeginX = 0;
    $.menuWin.addEventListener("touchstart", function(e) {
        touchBeginX = e.x;
    });
    $.menuWin.addEventListener("touchend", function() {
        var thresholdCloseMenu = .4 * $.menuTable.size.width;
        $.menuTable.left < -thresholdCloseMenu ? $.menuTable.animate({
            duration: 200,
            right: "100%",
            left: "-60%"
        }, function() {
            $.menuWin.close();
        }) : $.menuTable.animate({
            left: 0,
            duration: 100
        });
    });
    $.menuWin.addEventListener("touchmove", function(e) {
        var type = e.source.toString();
        if (-1 != type.indexOf("TableView")) {
            $.menuWin.fireEvent("touchmove", {
                x: e.x + $.menuTable.left,
                source: $.menuWin
            });
            return;
        }
        var x = e.x;
        var left = x - touchBeginX;
        0 > left && $.menuTable.animate({
            left: left,
            duration: 0
        });
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;