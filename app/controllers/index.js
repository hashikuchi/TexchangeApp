var Cloud = require("ti.cloud");
var facebook = require('facebook');
facebook.appid = '616913395091992'; //test
facebook.permissions = ['publish_stream', 'offline_access'];
facebook.addEventListener('login', function (e) {
    if (e.success) {
        // facebook.requestWithGraphPath('me', {}, {}, 'GET', function (e) {
            // if (e.success) {
                // var json = JSON.parse(e.result);
				// var mainWin = Alloy.createController('main',{
					// url: Alloy.Globals.BASE_URL +  '/members/' + json.name
				// }).getView();
				// mainWin.open();
            // }
        // });
        alert('success');
    } else if (e.error) {
        alert('error');
    } else if (e.cancelled) {
        alert('cancell');
    }
});
function login(){
	if($.userId.value.length === 0 || $.password.value.length === 0){
		alert('ユーザ名またはパスワードを入力してください。');
		return;
	}
	var url = Alloy.Globals.BASE_URL + '/wp-login.php';
	var loginClient = Ti.Network.createHTTPClient({
		onload: function(e){
			if(this.responseText.match('login_error')){
				alert('IDとパスワードの組合せが不正です。');	
			}else{
				var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'appData.txt');
				if(!file.exists){
					file.createFile();
				}
				file.write(JSON.stringify({
					'loginId': $.userId.value,
					'password': $.password.value,
					'rememberme': $.remembermeSwitch.value
				}));
				registerDeviceToken();
				var mainWin = Alloy.createController('main',{
					url: Alloy.Globals.BASE_URL +  '/members/' + $.userId.value
				}).getView();
				mainWin.open();
			}
		},
		onerror: function(e){
			Ti.API.debug(e.error);
			var errorDialog = Alloy.Globals.getConnectionErrorDialog();
			errorDialog.show();
		},
		timeout: 8000
	});
	loginClient.open("POST", url); 
	loginClient.send({
		'log': $.userId.value, 
		'pwd': $.password.value
	});
}

function _loginByFacebook(){
	var url = Alloy.Globals.BASE_URL;
	var pattern = /https:\/\/www.facebook.com\/dialog\/oauth.*scope=email/;
	
	var loginClient = Ti.Network.createHTTPClient({
		onload: function(e){
			var mainWin = Alloy.createController('main',{
				url: this.responseText.match(pattern)[0]
			}).getView();
			mainWin.open();
		},
		onerror: function(e){
			Ti.API.debug(e.error);
			var errorDialog = Alloy.Globals.getConnectionErrorDialog();
			errorDialog.show();
		},
		timeout: 8000
	});
	loginClient.open("GET", url); 
	loginClient.send();
}

function _loginByTwitter(){
	var url = Alloy.Globals.BASE_URL;
	var pattern = /https:\/\/api.twitter.com\/oauth\/authenticate\?oauth_token=[a-zA-Z0-9]*/;
	var loginClient = Ti.Network.createHTTPClient({
		onload: function(e){
			var mainWin = Alloy.createController('main',{
				url: this.responseText.match(pattern)[0]
			}).getView();
			mainWin.open();
		},
		onerror: function(e){
			Ti.API.debug(e.error);
			var errorDialog = Alloy.Globals.getConnectionErrorDialog();
			errorDialog.show();
		},
		timeout: 8000
	});
	loginClient.open("GET", url); 
	loginClient.send();
}

function loginByFacebook(){
	facebook.authorize();
}

function loginByTwitter(){
	twitter.addEventListener('login', function (e) {
        if (e.success) {
            Ti.App.Properties.setString('twitterAccessTokenKey', e.accessTokenKey);
            Ti.App.Properties.setString('twitterAccessTokenSecret', e.accessTokenSecret);
            twitter.request('1.1/account/verify_credentials.json', {}, {}, 'GET', function (e) {
                if (e.success) {
                    var json = JSON.parse(e.result.text);
                    registerDeviceToken();
                  	_loginByTwitter();
                } else {
					alert(e.result);
                }
            });
        } else {
            // error proc…
        }
    });
    twitter.authorize();
}

// setting methods for push notifications
// Process incoming push notifications

// Save the device token for subsequent API calls
function deviceTokenSuccess(e) {
    Alloy.Globals.deviceToken = e.deviceToken;
    subscribeToChannel();
    $.index.open();
}

function deviceTokenError(e) {
    alert('プッシュ通知の登録に失敗しました。 ' + e.error);
    $.index.open();
}

function subscribeToChannel() {
	Cloud.PushNotifications.subscribeToken({
        device_token: Alloy.Globals.deviceToken,
        channel: 'news_alerts',
        type: Ti.Platform.name == 'android' ? 'android' : 'ios'
    }, function (e) {
        if (e.success) {
			// do nothing
        } else {
            alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}

function registerDeviceToken(){
	var url = Alloy.Globals.BASE_URL + '/wp-admin/admin-ajax.php';
	var registerClient = Ti.Network.createHTTPClient({
		onload: function(e){
			// do nothing
		},
		onerror: function(e){
			Ti.API.debug(e.error);
			var errorDialog = Alloy.Globals.getConnectionErrorDialog();
			errorDialog.show();
		},
		timeout: 5000
	});
	registerClient.open("POST", url);
	registerClient.send({
		'action': 'register_app_information',
		'deviceToken': Alloy.Globals.deviceToken
	});
}

var data;
var configJSON;
var config;
configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config.json');
config = JSON.parse(configJSON.read().toString());
var twitter = require('twitter').Twitter({
	consumerKey:config.twitter.consumerKey,
	consumerSecret:config.twitter.consumerSecret,
	accessTokenKey: Ti.App.Properties.getString('twitterAccessTokenKey', ''),
	accessTokenSecret: Ti.App.Properties.getString('twitterAccessTokenSecret', '')
});

try{
	data = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'appData.txt').read());
	if(data.rememberme){
		$.userId.value = data.loginId;
		$.password.value = data.password;
		$.remembermeSwitch.value = data.rememberme;
	}
}catch(e){
	Ti.API.info('do nothing!');
}

// this method is for iOS devices only
Ti.Network.registerForPushNotifications({
    // Specifies which notifications to receive
    types: [
        Ti.Network.NOTIFICATION_TYPE_BADGE,
        Ti.Network.NOTIFICATION_TYPE_ALERT,
        Ti.Network.NOTIFICATION_TYPE_SOUND
    ],
    success: deviceTokenSuccess,
    error: deviceTokenError
});