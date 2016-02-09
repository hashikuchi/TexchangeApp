function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function closeWindow() {
        $.troubleshootingWindow.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "troubleshooting";
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
    var __defers = {};
    $.__views.troubleshootingWindow = Ti.UI.createWindow({
        id: "troubleshootingWindow",
        backgroundColor: "white"
    });
    $.__views.troubleshootingWindow && $.addTopLevelView($.__views.troubleshootingWindow);
    $.__views.__alloyId11 = Ti.UI.createLabel({
        font: {
            fontSize: 20,
            fontWeight: "bold"
        },
        text: "困ったときは",
        top: "50",
        id: "__alloyId11"
    });
    $.__views.troubleshootingWindow.add($.__views.__alloyId11);
    $.__views.__alloyId12 = Ti.UI.createLabel({
        font: {
            fontSize: 17
        },
        text: "Q.出品しようとすると「ログインされていないため出品できません。」と表示されます。",
        top: "120",
        left: "15",
        right: "15",
        id: "__alloyId12"
    });
    $.__views.troubleshootingWindow.add($.__views.__alloyId12);
    $.__views.__alloyId13 = Ti.UI.createLabel({
        font: {
            fontSize: 17
        },
        text: "A.Webのタブに表示されているテクスチェンジの画面がログアウト状態になっていますので、ログインしてください。特に、一部のAndroidスマートフォンでTwitterからログインした場合に起きることがあります。",
        top: "190",
        left: "15",
        right: "15",
        id: "__alloyId13"
    });
    $.__views.troubleshootingWindow.add($.__views.__alloyId13);
    $.__views.__alloyId14 = Ti.UI.createLabel({
        text: "この画面を閉じる",
        color: "#6495ed",
        top: "400",
        id: "__alloyId14"
    });
    $.__views.troubleshootingWindow.add($.__views.__alloyId14);
    closeWindow ? $.addListener($.__views.__alloyId14, "click", closeWindow) : __defers["$.__views.__alloyId14!click!closeWindow"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.__alloyId14!click!closeWindow"] && $.addListener($.__views.__alloyId14, "click", closeWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;