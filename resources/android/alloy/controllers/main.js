function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function __alloyId7() {
        $.__views.mainTabGroup.removeEventListener("open", __alloyId7);
        if ($.__views.mainTabGroup.activity) $.__views.mainTabGroup.activity.onCreateOptionsMenu = function(e) {
            var __alloyId4 = {
                showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
                icon: "images/menus/reload-32.png",
                title: "reload",
                id: "menuReload"
            };
            $.__views.menuReload = e.menu.add(_.pick(__alloyId4, Alloy.Android.menuItemCreateArgs));
            $.__views.menuReload.applyProperties(_.omit(__alloyId4, Alloy.Android.menuItemCreateArgs));
            $.menuReload = $.__views.menuReload;
            reloadWindowAndroid ? $.addListener($.__views.menuReload, "click", reloadWindowAndroid) : __defers["$.__views.menuReload!click!reloadWindowAndroid"] = true;
            var __alloyId5 = {
                showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
                icon: "images/menus/help-48.png",
                title: "help",
                id: "menuTroubleshooting"
            };
            $.__views.menuTroubleshooting = e.menu.add(_.pick(__alloyId5, Alloy.Android.menuItemCreateArgs));
            $.__views.menuTroubleshooting.applyProperties(_.omit(__alloyId5, Alloy.Android.menuItemCreateArgs));
            $.menuTroubleshooting = $.__views.menuTroubleshooting;
            openTroubleshootingWindow ? $.addListener($.__views.menuTroubleshooting, "click", openTroubleshootingWindow) : __defers["$.__views.menuTroubleshooting!click!openTroubleshootingWindow"] = true;
            var __alloyId6 = {
                showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
                icon: "images/menus/logout-48.png",
                title: "logout",
                id: "menuLogout"
            };
            $.__views.menuLogout = e.menu.add(_.pick(__alloyId6, Alloy.Android.menuItemCreateArgs));
            $.__views.menuLogout.applyProperties(_.omit(__alloyId6, Alloy.Android.menuItemCreateArgs));
            $.menuLogout = $.__views.menuLogout;
            onLogoutClick ? $.addListener($.__views.menuLogout, "click", onLogoutClick) : __defers["$.__views.menuLogout!click!onLogoutClick"] = true;
        }; else {
            Ti.API.warn("You attempted to attach an Android Menu to a lightweight Window");
            Ti.API.warn("or other UI component which does not have an Android activity.");
            Ti.API.warn("Android Menus can only be opened on TabGroups and heavyweight Windows.");
        }
    }
    function reloadWindowAndroid() {
        if ($.main.getActive()) {
            var url = mainWebView.getUrl();
            mainWebView.setUrl(url);
        }
    }
    function openTroubleshootingWindow() {
        var troubleshootingWindow = Alloy.createController("troubleshooting").getView();
        troubleshootingWindow.open({
            modal: true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        });
    }
    function onLogoutClick() {
        var confirm = Ti.UI.createAlertDialog({
            title: "ログアウトします",
            message: "よろしいですか？",
            cancel: 0,
            confirm: 1,
            buttonNames: [ "キャンセル", "はい" ]
        });
        confirm.addEventListener("click", function(e) {
            e.index === e.source.confirm && logout();
        });
        confirm.show();
    }
    function logout() {
        try {
            var loginData = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "appData.txt");
            if (loginData) {
                loginData.deleteFile();
                Ti.API.info("del");
            }
        } catch (e) {
            Ti.API.warn(e);
        }
        Alloy.Globals.Facebook.logout();
        Alloy.Globals.Twitter.logout();
        Ti.Network.removeAllHTTPCookies();
        var logoutClient = Ti.Network.createHTTPClient({
            onload: function() {
                Ti.API.info(this.responseText);
                var loClient = Ti.Network.createHTTPClient({
                    onload: function() {
                        Ti.API.info("logout success!");
                    },
                    onerror: function() {
                        Ti.API.info("logout error");
                    },
                    timeout: 5e3
                });
                loClient = Alloy.Globals.addCookieValueToHTTPClient(loClient);
                loClient.open("POST", Alloy.Globals.config.baseurl + "/wp-login.php");
                loClient.send({
                    action: "logout",
                    _wpnonce: this.responseText
                });
            },
            onerror: function() {
                Ti.API.debug(e.error);
            },
            timeout: 5e3
        });
        logoutClient = Alloy.Globals.addCookieValueToHTTPClient(logoutClient);
        logoutClient.open("POST", Alloy.Globals.ajaxUrl);
        logoutClient.send({
            action: "get_nonce_from_app",
            nonce_action: "log-out"
        });
        var index = Alloy.createController("index").getView();
        index.open();
        $.mainTabGroup.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "main";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        var __parentSymbol = __processArg(arguments[0], "__parentSymbol");
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
    var __alloyId2 = [];
    $.__views.mainTab = Alloy.createController("mainWebView", {
        id: "mainTab",
        __parentSymbol: __parentSymbol
    });
    $.__views.main = Ti.UI.createTab({
        window: $.__views.mainTab.getViewEx({
            recurse: true
        }),
        id: "main",
        title: "Web",
        icon: "images/tabs/web-32.png"
    });
    __alloyId2.push($.__views.main);
    $.__views.exhibitionTab = Alloy.createController("exhibition/exhibitionView", {
        id: "exhibitionTab",
        __parentSymbol: __parentSymbol
    });
    $.__views.exhibition = Ti.UI.createTab({
        window: $.__views.exhibitionTab.getViewEx({
            recurse: true
        }),
        id: "exhibition",
        title: "出品",
        icon: "images/tabs/barcode_scanner-32.png"
    });
    __alloyId2.push($.__views.exhibition);
    $.__views.mainTabGroup = Ti.UI.createTabGroup({
        tabs: __alloyId2,
        id: "mainTabGroup",
        title: "ユーザ名: "
    });
    $.__views.mainTabGroup.addEventListener("open", __alloyId7);
    $.__views.mainTabGroup && $.addTopLevelView($.__views.mainTabGroup);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var url = args.url || Alloy.Globals.config.baseurl;
    args.loginId || "";
    var mainWebView = $.mainTab.getView("mainWebView");
    mainWebView.url = url;
    $.mainTabGroup.addEventListener("androidback", function() {
        $.main.getActive() && mainWebView.goBack();
    });
    var getUserLoginInfoClient = Ti.Network.createHTTPClient({
        onload: function() {
            var userLoginInfo = JSON.parse(this.responseText);
            $.mainTabGroup.title += userLoginInfo.data.display_name;
        },
        onerror: function(e) {
            Ti.API.debug(e.error);
            var errorDialog = Alloy.Globals.getConnectionErrorDialog();
            errorDialog.show();
        },
        timeout: 5e3
    });
    getUserLoginInfoClient.open("POST", Alloy.Globals.config.baseurl + "/wp-admin/admin-ajax.php");
    getUserLoginInfoClient.send({
        action: "get_login_user_info"
    });
    __defers["$.__views.menuReload!click!reloadWindowAndroid"] && $.addListener($.__views.menuReload, "click", reloadWindowAndroid);
    __defers["$.__views.menuTroubleshooting!click!openTroubleshootingWindow"] && $.addListener($.__views.menuTroubleshooting, "click", openTroubleshootingWindow);
    __defers["$.__views.menuLogout!click!onLogoutClick"] && $.addListener($.__views.menuLogout, "click", onLogoutClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;