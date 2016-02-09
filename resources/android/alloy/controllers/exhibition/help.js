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
        $.helpWindow.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "exhibition/help";
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
    $.__views.helpWindow = Ti.UI.createWindow({
        id: "helpWindow",
        backgroundColor: "white"
    });
    $.__views.helpWindow && $.addTopLevelView($.__views.helpWindow);
    $.__views.__alloyId21 = Ti.UI.createLabel({
        font: {
            fontSize: 20,
            fontWeight: "bold"
        },
        text: "出品機能はかんたん3ステップ！",
        top: "50",
        id: "__alloyId21"
    });
    $.__views.helpWindow.add($.__views.__alloyId21);
    $.__views.__alloyId22 = Ti.UI.createLabel({
        font: {
            fontSize: 17
        },
        text: "1.「バーコードを読み取る」ボタンを押します。",
        top: "120",
        left: "15",
        right: "15",
        id: "__alloyId22"
    });
    $.__views.helpWindow.add($.__views.__alloyId22);
    $.__views.__alloyId23 = Ti.UI.createLabel({
        font: {
            fontSize: 17
        },
        text: '2.スマホのカメラで出品したい本の"上の方の"バーコードを読み取ります。',
        top: "180",
        left: "15",
        right: "15",
        id: "__alloyId23"
    });
    $.__views.helpWindow.add($.__views.__alloyId23);
    $.__views.__alloyId24 = Ti.UI.createLabel({
        font: {
            fontSize: 17
        },
        text: "3.続いて表示される画面で「出品」ボタンを押します。出品完了です！",
        top: "240",
        left: "15",
        right: "15",
        id: "__alloyId24"
    });
    $.__views.helpWindow.add($.__views.__alloyId24);
    $.__views.__alloyId25 = Ti.UI.createLabel({
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: 13
        },
        text: "※一度で正常に読み取れない場合には再度読み取りをお試しください。",
        top: "300",
        left: "15",
        right: "15",
        id: "__alloyId25"
    });
    $.__views.helpWindow.add($.__views.__alloyId25);
    $.__views.__alloyId26 = Ti.UI.createLabel({
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: 13
        },
        text: "※カメラでバーコードが読み取れない場合、バーコード下の数字を上部のフォームに直接入力しても出品できます。",
        top: "350",
        left: "15",
        right: "15",
        id: "__alloyId26"
    });
    $.__views.helpWindow.add($.__views.__alloyId26);
    $.__views.__alloyId27 = Ti.UI.createLabel({
        text: "この画面を閉じる",
        color: "#6495ed",
        top: "400",
        id: "__alloyId27"
    });
    $.__views.helpWindow.add($.__views.__alloyId27);
    closeWindow ? $.addListener($.__views.__alloyId27, "click", closeWindow) : __defers["$.__views.__alloyId27!click!closeWindow"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.__alloyId27!click!closeWindow"] && $.addListener($.__views.__alloyId27, "click", closeWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;