var Cloud = require("ti.cloud");
var facebook = Alloy.Globals.Facebook;
var data;
var twitter;
var osname = Ti.Platform.getOsname();
var osversion = Ti.Platform.getVersion();
var cookie;

facebook.appid = Alloy.Globals.config.facebook.appid;
facebook.permissions = ['publish_stream', 'offline_access'];
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
    	// do nothing
    }
});

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
					var cookies = Ti.Network.getHTTPCookiesForDomain('beak.sakura.ne.jp');
					cookies.forEach(function(cookie){
						Ti.Network.addSystemCookie(cookie);
					});
				}
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

function jumpToFacebookLoginLink(){
	var url = Alloy.Globals.config.baseurl;
	var pattern = /https:\/\/www.facebook.com\/dialog\/oauth.*scope=email/;
	
	var loginClient = Ti.Network.createHTTPClient({
		onload: function(e){
			var mainWin = Alloy.createController('main',{
				url: this.responseText.match(pattern)?this.responseText.match(pattern)[0]:Alloy.Globals.config.baseurl
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

function jumpToTwitterLoginLink(){
	var url = Alloy.Globals.config.baseurl;
	var pattern = /https:\/\/api.twitter.com\/oauth\/authenticate\?oauth_token=[a-zA-Z0-9]*/;
	var loginClient = Ti.Network.createHTTPClient({
		onload: function(e){
			var mainWin = Alloy.createController('main',{
				url: this.responseText.match(pattern)?this.responseText.match(pattern)[0]:Alloy.Globals.config.baseurl
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

twitter = require('twitter').Twitter({
	consumerKey: Alloy.Globals.config.twitter.consumerKey,
	consumerSecret: Alloy.Globals.config.twitter.consumerSecret,
	accessTokenKey: Ti.App.Properties.getString('twitterAccessTokenKey', ''),
	accessTokenSecret: Ti.App.Properties.getString('twitterAccessTokenSecret', '')
});

Ti.API.info("osname =" + osname);
Ti.API.info("osname =" + osversion);

// 検証すべき内容
// 1. 新規ユーザとしてログインした際にデバイストークンが登録されるか？
// 2. プッシュ通知を受け取ることができるか？
// 以上2点をiphone新旧 および Androidにて検証する

// checklist
// android ログイン完了。
// iphone ios6 デバイストークンの登録、サジェスト登録はされるが、ウェブサービスからのプッシュ通知がうまくいってない
// iphone ios8　デバイストークンの登録、サジェスト登録はされるが、ウェブサービスからのプッシュ通知がうまくいってない
// appceleratorのログを見るとプッシュ通知は送信されているようだが、届いてない

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