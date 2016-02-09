function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "searchBooks";
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
    $.__views.__alloyId10 = Ti.UI.createLabel({
        text: "search",
        id: "__alloyId10"
    });
    $.__views.mainWin.add($.__views.__alloyId10);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.mainWin.add(Alloy.Globals.createCommonHeader($.mainWin));
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;