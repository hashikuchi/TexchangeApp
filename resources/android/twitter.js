var exports = exports || this;

exports.Twitter = function() {
    function createAuthWindow() {
        var self = this, oauth = this.oauthClient, webViewWindow = Ti.UI.createWindow({
            title: this.windowTitle
        }), webView = Ti.UI.createWebView(), loadingOverlay = Ti.UI.createView({
            backgroundColor: "black",
            opacity: .7,
            zIndex: 1
        }), actInd = Titanium.UI.createActivityIndicator({
            height: 50,
            width: 10,
            message: "Loading...",
            color: "white"
        }), closeButton = Ti.UI.createButton({
            title: this.windowClose
        }), backButton = Ti.UI.createButton({
            title: this.windowBack
        });
        this.webView = webView;
        webViewWindow.leftNavButton = closeButton;
        actInd.show();
        loadingOverlay.add(actInd);
        webViewWindow.add(loadingOverlay);
        webViewWindow.open({
            modal: true
        });
        webViewWindow.add(webView);
        closeButton.addEventListener("click", function() {
            webViewWindow.close();
            self.fireEvent("cancel", {
                success: false,
                error: "The user cancelled.",
                result: null
            });
        });
        backButton.addEventListener("click", function() {
            webView.goBack();
        });
        webView.addEventListener("beforeload", function() {
            isAndroid || webViewWindow.add(loadingOverlay);
            actInd.show();
        });
        webView.addEventListener("load", function(event) {
            if (-1 === event.url.indexOf(self.authorizeUrl)) {
                webViewWindow.remove(loadingOverlay);
                actInd.hide();
                webViewWindow.leftNavButton !== backButton && (webViewWindow.leftNavButton = backButton);
            } else {
                webViewWindow.leftNavButton !== closeButton && (webViewWindow.leftNavButton = closeButton);
                if (isAndroid && event.source.url === self.authorizeUrl) {
                    var promptView = Ti.UI.createView({
                        width: "70%",
                        height: "15%",
                        layout: "vertical",
                        backgroundColor: "black",
                        bottom: "10%"
                    }), pinField = Ti.UI.createTextField({
                        width: Ti.UI.FILL,
                        font: {
                            fontSize: "20dp"
                        },
                        height: Ti.UI.SIZE,
                        hintText: "表示されているPINコードを入力してください。"
                    }), pinButton = Ti.UI.createButton({
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE,
                        title: "認証"
                    });
                    promptView.add(pinField);
                    promptView.add(pinButton);
                    webViewWindow.add(promptView);
                    pinButton.addEventListener("click", function() {
                        if (pinField.value) {
                            oauth.accessTokenUrl = "https://api.twitter.com/oauth/access_token?oauth_verifier=" + pinField.value;
                            oauth.fetchAccessToken(function() {
                                self.fireEvent("login", {
                                    success: true,
                                    error: false,
                                    accessTokenKey: oauth.getAccessTokenKey(),
                                    accessTokenSecret: oauth.getAccessTokenSecret()
                                });
                                self.authorized = true;
                                webViewWindow.close();
                            }, function(data) {
                                self.fireEvent("login", {
                                    success: false,
                                    error: "アクセストークンを取得できませんでした。やり直してください。",
                                    result: data
                                });
                            });
                        } else alert("PINコードを入力してください");
                    });
                } else {
                    var pin = event.source.evalJS("document.getElementById('oauth_pin').getElementsByTagName('code')[0].innerText");
                    if (pin) {
                        isAndroid || webViewWindow.close();
                        oauth.accessTokenUrl = "https://api.twitter.com/oauth/access_token?oauth_verifier=" + pin;
                        oauth.fetchAccessToken(function() {
                            self.fireEvent("login", {
                                success: true,
                                error: false,
                                accessTokenKey: oauth.getAccessTokenKey(),
                                accessTokenSecret: oauth.getAccessTokenSecret()
                            });
                            self.authorized = true;
                            isAndroid && webViewWindow.close();
                        }, function(data) {
                            self.fireEvent("login", {
                                success: false,
                                error: "Failure to fetch access token, please try again.",
                                result: data
                            });
                        });
                    } else {
                        webViewWindow.remove(loadingOverlay);
                        actInd.hide();
                    }
                }
            }
        });
    }
    var K = function() {}, isAndroid = true, jsOAuth = require("jsOAuth-1.3.3");
    var Twitter = function(options) {
        var self;
        self = this instanceof Twitter ? this : new K();
        options || (options = {});
        self.windowTitle = options.windowTitle || "Twitter Authorization";
        self.windowClose = options.windowClose || "Close";
        self.windowBack = options.windowBack || "Back";
        self.consumerKey = options.consumerKey;
        self.consumerSecret = options.consumerSecret;
        self.authorizeUrl = "https://api.twitter.com/oauth/authorize";
        self.accessTokenKey = options.accessTokenKey;
        self.accessTokenSecret = options.accessTokenSecret;
        self.authorized = false;
        self.listeners = {};
        self.accessTokenKey && self.accessTokenSecret && (self.authorized = true);
        options.requestTokenUrl = options.requestTokenUrl || "https://api.twitter.com/oauth/request_token";
        self.oauthClient = jsOAuth.OAuth(options);
        return self;
    };
    K.prototype = Twitter.prototype;
    Twitter.prototype.authorize = function() {
        var self = this;
        if (this.authorized) setTimeout(function() {
            self.fireEvent("login", {
                success: true,
                error: false,
                accessTokenKey: self.accessTokenKey,
                accessTokenSecret: self.accessTokenSecret
            });
        }, 1); else {
            createAuthWindow.call(this);
            this.oauthClient.fetchRequestToken(function(requestParams) {
                var authorizeUrl = self.authorizeUrl + requestParams;
                self.webView.url = authorizeUrl;
            }, function(data) {
                self.fireEvent("login", {
                    success: false,
                    error: "Failure to fetch access token, please try again.",
                    result: data
                });
            });
        }
    };
    Twitter.prototype.request = function(path, params, headers, httpVerb, callback) {
        var url, self = this, oauth = this.oauthClient;
        url = path.match(/^https?:\/\/.+/i) ? path : "https://api.twitter.com/" + path;
        oauth.request({
            method: httpVerb,
            url: url,
            data: params,
            headers: headers,
            success: function(data) {
                callback.call(self, {
                    success: true,
                    error: false,
                    result: data
                });
            },
            failure: function(data) {
                callback.call(self, {
                    success: false,
                    error: "Request failed",
                    result: data
                });
            }
        });
    };
    Twitter.prototype.logout = function(callback) {
        this.oauthClient.setAccessToken("", "");
        this.accessTokenKey = null;
        this.accessTokenSecret = null;
        this.authorized = false;
        "function" == typeof callback && callback();
    };
    Twitter.prototype.addEventListener = function(eventName, callback) {
        this.listeners = this.listeners || {};
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(callback);
    };
    Twitter.prototype.fireEvent = function(eventName, data) {
        var eventListeners = this.listeners[eventName] || [];
        for (var i = 0; i < eventListeners.length; i++) eventListeners[i].call(this, data);
    };
    return Twitter;
}(this);