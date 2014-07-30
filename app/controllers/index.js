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
					loginId: $.userId.value
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

// setting methods for push notifications
// Process incoming push notifications
var Cloud = require("ti.cloud");

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