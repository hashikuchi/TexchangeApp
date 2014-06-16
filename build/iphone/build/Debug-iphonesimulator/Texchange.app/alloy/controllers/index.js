function Controller() {
    function login() {
        var url = "http://127.0.0.1/wp/texchange/wp-login.php";
        var loginClient = Ti.Network.createHTTPClient({
            onload: function() {
                this.responseText.match("login_error") ? alert("error!") : alert("login!");
            },
            onerror: function(e) {
                Ti.API.debug("error:" + e.error);
            },
            timeout: 5e3
        });
        loginClient.open("POST", url);
        loginClient.send({
            log: $.userId.value,
            pwd: $.password.value
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.userId = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        width: 250,
        height: 60,
        id: "userId",
        color: "#336699",
        top: "10",
        left: "10",
        hintText: "ユーザ名"
    });
    $.__views.index.add($.__views.userId);
    $.__views.password = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        width: 250,
        height: 60,
        passwordMask: true,
        id: "password",
        color: "#336699",
        top: "100",
        left: "10",
        hintText: "パスワード"
    });
    $.__views.index.add($.__views.password);
    $.__views.loginBtn = Ti.UI.createButton({
        id: "loginBtn",
        title: "ログイン",
        top: "170",
        width: "150",
        height: "60"
    });
    $.__views.index.add($.__views.loginBtn);
    login ? $.__views.loginBtn.addEventListener("click", login) : __defers["$.__views.loginBtn!click!login"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.loginBtn!click!login"] && $.__views.loginBtn.addEventListener("click", login);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;