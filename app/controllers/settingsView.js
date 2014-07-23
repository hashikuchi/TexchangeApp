var Cloud = require("ti.cloud");

function enablePushNotification() {
	Cloud.PushNotifications.subscribeToken({
        device_token: Alloy.Globals.deviceToken,
        channel: 'news_alerts',
        type: Ti.Platform.name == 'android' ? 'android' : 'ios'
    }, function (e) {
        if (e.success) {
            alert('プッシュ通知を許可しました。');
        } else {
            alert('エラーが発生しました:\n' + ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}

function disablePushNotification(){
	Cloud.PushNotifications.unsubscribeToken({
        channel: 'news_alerts',
        device_token: Alloy.Globals.deviceToken
    }, function (e) {
        if (e.success) {
            alert('プッシュ通知を解除しました。');
        } else {
            alert('エラーが発生しました。\n' +
                ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}

$.pushNotificationSwitch.addEventListener('change', function(e){
	if($.pushNotificationSwitch.value) {
		enablePushNotification();	
	}else{
		disablePushNotification();
	}
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'appData.txt');
	if(!file.exists){
		file.createFile();
	}
	var data = JSON.parse(file.read());
	file.write(JSON.stringify({
		'loginId': data.loginId,
		'password': data.password,
		'rememberme': data.rememberme,
		'enablePushNotification': $.pushNotificationSwitch.value
	}));
});

var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'appData.txt');
var data = JSON.parse(file.read());
if(!file.exists){
	file.createFile();
}

$.pushNotificationSwitch.value = data.enablePushNotification;