function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "main";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __alloyId0 = [];
    $.__views.myPageWindow = Ti.UI.createWindow({
        id: "myPageWindow",
        title: "マイページ"
    });
    $.__views.myPage = Ti.UI.createTab({
        window: $.__views.myPageWindow,
        id: "myPage"
    });
    __alloyId0.push($.__views.myPage);
    $.__views.exhibitionWindow = Ti.UI.createWindow({
        id: "exhibitionWindow",
        title: "出品"
    });
    $.__views.exhibition = Ti.UI.createTab({
        window: $.__views.exhibitionWindow,
        id: "exhibition"
    });
    __alloyId0.push($.__views.exhibition);
    $.__views.mainTabGroup = Ti.UI.createTabGroup({
        tabs: __alloyId0,
        id: "mainTabGroup"
    });
    $.__views.mainTabGroup && $.addTopLevelView($.__views.mainTabGroup);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;