function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function login() {
        if (0 === $.userId.value.length || 0 === $.password.value.length) {
            alert("ユーザ名またはパスワードを入力してください。");
            return;
        }
        var url = Alloy.Globals.config.baseurl + "/wp-login.php";
        var loginClient = Ti.Network.createHTTPClient({
            onload: function() {
                if (this.responseText.match("login_error")) alert("IDとパスワードの組合せが不正です。"); else {
                    rememberme("texchange");
                    var mainWin = Alloy.createController("searchBooks").getView();
                    if ("android" == osname) {
                        var cookies = Ti.Network.getHTTPCookiesForDomain(Alloy.Globals.config.domain);
                        cookies.forEach(function(cookie) {
                            Ti.Network.addSystemCookie(cookie);
                        });
                    }
                    mainWin.open();
                    $.index.close();
                }
            },
            onerror: function(e) {
                Ti.API.debug(e.error);
                var errorDialog = Alloy.Globals.getConnectionErrorDialog();
                errorDialog.show();
            },
            timeout: 8e3
        });
        loginClient.open("POST", url);
        loginClient.send({
            log: $.userId.value,
            pwd: $.password.value
        });
    }
    function jumpToSocialLoginLink(pattern) {
        var loginClient = Ti.Network.createHTTPClient({
            onload: function() {
                var url = this.responseText.match(pattern) ? this.responseText.match(pattern)[0] : Alloy.Globals.config.baseurl;
                var mainController = Alloy.createController("main", {
                    url: url
                });
                var mainWin = mainController.getView();
                if ("android" == osname) {
                    var cookies = Ti.Network.getHTTPCookiesForDomain(Alloy.Globals.config.domain);
                    cookies.forEach(function(cookie) {
                        Ti.Network.addSystemCookie(cookie);
                    });
                }
                mainWin.open();
                $.index.close();
            },
            onerror: function(e) {
                Ti.API.debug(e.error);
                var errorDialog = Alloy.Globals.getConnectionErrorDialog();
                errorDialog.show();
            },
            timeout: 8e3
        });
        loginClient.open("POST", Alloy.Globals.config.baseurl);
        loginClient.send();
    }
    function jumpToFacebookLoginLink() {
        var pattern = /https:\/\/www.facebook.com\/dialog\/oauth.*scope=email/;
        jumpToSocialLoginLink(pattern);
    }
    function jumpToTwitterLoginLink() {
        var pattern = /https:\/\/api.twitter.com\/oauth\/authenticate\?oauth_token=[0-9a-zA-Z-_]*/;
        jumpToSocialLoginLink(pattern);
    }
    function loginByFacebook() {
        facebook.authorize();
    }
    function loginByTwitter() {
        twitter.addEventListener("login", function(e) {
            if (e.success) {
                Ti.App.Properties.setString("twitterAccessTokenKey", e.accessTokenKey);
                Ti.App.Properties.setString("twitterAccessTokenSecret", e.accessTokenSecret);
                twitter.request("1.1/account/verify_credentials.json", {}, {}, "GET", function(e) {
                    if (e.success) {
                        rememberme("twitter");
                        jumpToTwitterLoginLink();
                    } else alert(e.result);
                });
            } else alert(e.error);
        });
        twitter.authorize();
    }
    function rememberme(type) {
        var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "appData.txt");
        file.exists || file.createFile();
        file.write(JSON.stringify({
            loginId: $.userId.value,
            password: $.password.value,
            rememberme: $.remembermeSwitch.value,
            remembermeType: type
        }));
    }
    function openIndexWindow() {
        $.index.open();
    }
    function openRegisterForm() {
        var url = Alloy.Globals.config.baseurl + "/register/";
        Ti.Platform.openURL(url);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
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
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        viewShadowColor: "black",
        opacity: 1,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.userId = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        width: 250,
        height: 60,
        id: "userId",
        color: "#336699",
        top: "40",
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
        top: "130",
        hintText: "パスワード"
    });
    $.__views.index.add($.__views.password);
    $.__views.loginBtn = Ti.UI.createButton({
        borderRadius: 10,
        backgroundColor: "#00bfff",
        color: "white",
        id: "loginBtn",
        title: "ログイン",
        top: "200",
        width: "200",
        height: "60"
    });
    $.__views.index.add($.__views.loginBtn);
    login ? $.addListener($.__views.loginBtn, "click", login) : __defers["$.__views.loginBtn!click!login"] = true;
    $.__views.remembermeSwitch = Ti.UI.createSwitch({
        value: true,
        id: "remembermeSwitch",
        top: "370",
        left: "35"
    });
    $.__views.index.add($.__views.remembermeSwitch);
    $.__views.__alloyId1 = Ti.UI.createLabel({
        text: "ログイン状態を維持",
        top: "370",
        left: "105",
        id: "__alloyId1"
    });
    $.__views.index.add($.__views.__alloyId1);
    $.__views.registerBtn = Ti.UI.createButton({
        borderRadius: 10,
        backgroundColor: "#ff6c00",
        color: "white",
        id: "registerBtn",
        title: "新規登録はこちら",
        top: "450",
        width: "200",
        height: "60"
    });
    $.__views.index.add($.__views.registerBtn);
    openRegisterForm ? $.addListener($.__views.registerBtn, "click", openRegisterForm) : __defers["$.__views.registerBtn!click!openRegisterForm"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var facebook = Alloy.Globals.Facebook;
    var data;
    var twitter = Alloy.Globals.Twitter;
    var osname = Ti.Platform.getOsname();
    var osversion = Ti.Platform.getVersion();
    facebook.appid = Alloy.Globals.config.facebook.appid;
    facebook.addEventListener("login", function(e) {
        e.success ? facebook.requestWithGraphPath("me", {}, "GET", function(e) {
            if (e.success) {
                rememberme("facebook");
                jumpToFacebookLoginLink();
            }
        }) : e.error ? alert("facebookログインに失敗しました。") : e.cancelled && Ti.API.info("facebook login was cancelled...");
    });
    facebook.getLoggedIn() && "android" == osname && jumpToFacebookLoginLink();
    Ti.API.info("osname =" + osname);
    Ti.API.info("osname =" + osversion);
    try {
        data = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "appData.txt").read());
        $.remembermeSwitch.value = data.rememberme;
        if (data.rememberme) {
            $.userId.value = data.loginId;
            $.password.value = data.password;
            switch (data.remembermeType) {
              case "twitter":
                loginByTwitter();
                break;

              case "facebook":
                loginByFacebook();
                break;

              case "texchange":
                login();
            }
        }
    } catch (e) {
        Ti.API.info("do nothing!");
    }
    data && data.rememberme || openIndexWindow();
    __defers["$.__views.loginBtn!click!login"] && $.addListener($.__views.loginBtn, "click", login);
    __defers["$.__views.registerBtn!click!openRegisterForm"] && $.addListener($.__views.registerBtn, "click", openRegisterForm);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;