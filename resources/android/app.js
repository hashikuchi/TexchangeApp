var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "config.json");

var config = JSON.parse(configJSON.read().toString()).test;

Alloy.Globals.config = config;

Alloy.Globals.ajaxUrl = Alloy.Globals.config.baseurl + "/wp-admin/admin-ajax.php";

Alloy.Globals.Facebook = require("facebook");

Alloy.Globals.Twitter = require("twitter").Twitter({
    consumerKey: Alloy.Globals.config.twitter.consumerKey,
    consumerSecret: Alloy.Globals.config.twitter.consumerSecret,
    accessTokenKey: Ti.App.Properties.getString("twitterAccessTokenKey", ""),
    accessTokenSecret: Ti.App.Properties.getString("twitterAccessTokenSecret", "")
});

Alloy.Globals.getConnectionErrorDialog = function() {
    return Ti.UI.createAlertDialog({
        title: "通信エラー",
        message: "ネットワーク状況を確認してください。"
    });
};

Alloy.Globals.addCookieValueToHTTPClient = function(httpClient) {
    if ("android" == Ti.Platform.getOsname()) {
        var systemCookies = Ti.Network.getSystemCookies(Alloy.Globals.config.domain, Alloy.Globals.config.cookiepath, null);
        var cookiestrings = "";
        if (systemCookies) {
            systemCookies.forEach(function(cookie) {
                cookiestrings += "; " + cookie.name + "=" + cookie.value;
            });
            httpClient.setRequestHeader("Cookie:", cookiestrings);
        }
    }
    return httpClient;
};

Alloy.Globals.deviceToken = null;

Alloy.Globals.createCommonHeader = function() {
    var headerView = Ti.UI.createView({
        borderColor: "black",
        borderWidth: 1,
        height: 70,
        top: 0
    });
    var hamburger = Ti.UI.createImageView({
        image: "/images/hamburger.png",
        left: 20,
        top: 30
    });
    hamburger.addEventListener("touchend", function() {
        var menuWin = Alloy.createController("menu").getView();
        var animation = Ti.UI.createAnimation({
            duration: 200,
            left: 0
        });
        menuWin.open();
        menuWin.getChildren()[0].animate(animation);
    });
    headerView.add(hamburger);
    return headerView;
};

Alloy.createController("index");