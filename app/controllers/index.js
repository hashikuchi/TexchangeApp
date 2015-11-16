var Cloud = require("ti.cloud");
var facebook = Alloy.Globals.Facebook;
var data;
var twitter = Alloy.Globals.Twitter;
var osname = Ti.Platform.getOsname();
var osversion = Ti.Platform.getVersion();
var cookie;

facebook.appid = Alloy.Globals.config.facebook.appid;
facebook.addEventListener('login', function (e) {
    if (e.success) {
        facebook.requestWithGraphPath('me', {}, 'GET', function (e) {
            if (e.success) {
            	rememberme('facebook');
				jumpToFacebookLoginLink();
            }
        });
    } else if (e.error) {
        alert('facebookログインに失敗しました。');
    } else if (e.cancelled) {
    	Ti.API.info("facebook login was cancelled...");
    }
});
// If already logged in with facebook, directly open screen
// Without this, web view is not opened in android
if(facebook.getLoggedIn() && osname == "android"){
	jumpToFacebookLoginLink();
}

function login(){
	if($.userId.value.length === 0 || $.password.value.length === 0){
		alert('ユーザ名またはパスワードを入力してください。');
		return;
	}
	var url = Alloy.Globals.config.baseurl + '/wp-login.php';
	var loginClient = Ti.Network.createHTTPClient({
		onload: function(e){
			if(this.responseText.match('login_error')){
				alert('IDとパスワードの組合せが不正です。');	
			}else{
				rememberme('texchange');
				registerDeviceToken();
				var mainWin = Alloy.createController('main',{
					url: Alloy.Globals.config.baseurl +  '/members/' + $.userId.value
				}).getView();

				if(osname == 'android'){
					// Save cookie for Android WebView
					var cookies = Ti.Network.getHTTPCookiesForDomain(Alloy.Globals.config.domain);
					cookies.forEach(function(cookie){
						Ti.Network.addSystemCookie(cookie);
					});
				}
				mainWin.open();
				$.index.close(); // 戻るボタンで戻ってこれないように画面を閉じる
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

// アプリのトップ画面からソーシャルログインを選択した場合に、Web画面トップにあるソーシャルログインリンクを自動的に踏ませるための関数です。
// アプリのログインとWebのログインは別物のため、別個に処理する必要があるためです。
// @pattern: String ソーシャルログインボタンのhref属性にマッチする正規表現パターン
function jumpToSocialLoginLink(pattern){
	var loginClient = Ti.Network.createHTTPClient({
		onload: function(e){
			// 正規表現でログインリンクを取得
			// もしマッチしなかった場合はトップページに遷移しますが、単なる異常終了回避なので、正規表現を確認しなおしてください。
			var url = this.responseText.match(pattern)?this.responseText.match(pattern)[0]:Alloy.Globals.config.baseurl;
			var mainController = Alloy.createController('main',{
				url: url
			});
			var mainWin = mainController.getView();
			if(osname == 'android'){
				// Save cookie for Android WebView
				// Android端末の場合、WebViewのCookieがHTTPClientのCookieと同期しないので、手動でセットしてやる必要があります。
				var cookies = Ti.Network.getHTTPCookiesForDomain(Alloy.Globals.config.domain);
				cookies.forEach(function(cookie){
					Ti.Network.addSystemCookie(cookie);
				});
			}
			mainWin.open();
			$.index.close(); // 戻るボタンで戻ってこれないように画面を閉じる
		},
		onerror: function(e){
			Ti.API.debug(e.error);
			var errorDialog = Alloy.Globals.getConnectionErrorDialog();
			errorDialog.show();
		},
		timeout: 8000
	});
	loginClient.open("POST", Alloy.Globals.config.baseurl); // メソッドはPOSTを使用しないとiOSでCookieが正しく引き継がれない。
	loginClient.send();
}

// Facebookでログイン時に、「Facebookでログイン」ボタンを踏ませます。
// patternはGianismのバージョンによって変える必要がある可能性があるので注意してください。
// 現在のパターンはver.1.3.1に合わせてあります。
function jumpToFacebookLoginLink(){
	var pattern = /https:\/\/www.facebook.com\/dialog\/oauth.*scope=email/;
	jumpToSocialLoginLink(pattern);
}

// Twitterでログイン時に、「Twitterでログイン」ボタンを踏ませます。
// patternはGianismのバージョンによって変える必要がある可能性があるので注意してください。
// 現在のパターンはver.1.3.1に合わせてあります。
function jumpToTwitterLoginLink(){
	var pattern = /https:\/\/api.twitter.com\/oauth\/authenticate\?oauth_token=[0-9a-zA-Z-_]*/;
	jumpToSocialLoginLink(pattern);
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
                	rememberme('twitter');
                    registerDeviceToken();
                  	jumpToTwitterLoginLink();
                } else {
					alert(e.result);
                }
            });
        } else {
            // error proc…
            alert(e.error);
        }
    });
    twitter.authorize();
}

// setting methods for push notifications
// Process incoming push notifications

// function called when device token is gotten
// Save the device token for subsequent API calls
function deviceTokenSuccess(e) {
    Alloy.Globals.deviceToken = e.deviceToken;
    subscribeToChannel();
}

// function called when device token cannot be taken
function deviceTokenError(e) {
    alert('プッシュ通知の登録に失敗しました。 ' + e.error);
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
	var url = Alloy.Globals.config.baseurl + '/wp-admin/admin-ajax.php';
	var registerClient = Ti.Network.createHTTPClient({
		onload: function(e){
			Ti.API.info("registerDeviceToken: device token is registered successfully");
		},
		onerror: function(e){
			Ti.API.debug(e.error);
			var errorDialog = Alloy.Globals.getConnectionErrorDialog();
			errorDialog.show();
		},
		timeout: 5000
	});
	registerClient.open("POST", url);
	Ti.API.info("device token is " + Alloy.Globals.deviceToken);
	registerClient.send({
		'action': 'register_app_information',
		'deviceToken': Alloy.Globals.deviceToken
	});
}

function rememberme(type){
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'appData.txt');
	if(!file.exists){
		file.createFile();
	}
	file.write(JSON.stringify({
		'loginId': $.userId.value,
		'password': $.password.value,
		'rememberme': $.remembermeSwitch.value,
		'remembermeType': type
	}));
}

function openIndexWindow(){
	$.index.open();
}

// メールアドレスによる新規登録フォームを外部ブラウザで開く
function openRegisterForm(){
	var url = Alloy.Globals.config.baseurl + "/register/";
	Ti.Platform.openURL(url);
}

Ti.API.info("osname =" + osname);
Ti.API.info("osname =" + osversion);

if(osname == "android"){
	var CloudPush= require("ti.cloudpush"); // import cloud push module for Android devices
	// Obtain device token for android devices
	CloudPush.retrieveDeviceToken({
    	success: deviceTokenSuccess,
    	error: deviceTokenError
	});
}else if(osname == "iphone"){
	if(osversion.split(".")[0] >= 8){
		// ios8 or later
		function registerForPush() {
	        Ti.Network.registerForPushNotifications({
	            success: deviceTokenSuccess,
	            error: deviceTokenError
	        });
	        // Remove event listener once registered for push notifications
	        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);
	    };

		// Wait for user settings to be registered before registering for push notifications
	    Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);

	    // Register notification types to use
	    Ti.App.iOS.registerUserNotificationSettings({
		    types: [
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
	        ]
	    });
	}else{
		// ios7 or older
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
	}
}

// TODO call registerUserNotificationSettings method here

// this method is for iOS devices only
/* moved to if statement above...
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
*/
try{
	data = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'appData.txt').read());
	$.remembermeSwitch.value = data.rememberme;
	if(data.rememberme){
		$.userId.value = data.loginId;
		$.password.value = data.password;
		switch(data.remembermeType){
			case 'twitter':
				loginByTwitter();
				break;
			case 'facebook':
				loginByFacebook();
				break;
			case 'texchange':
				login();
				break;
		}
	}
}catch(e){
	Ti.API.info('do nothing!');
}

// open index window on initial running or not remember me
if(!data || !data.rememberme){
	openIndexWindow();
}