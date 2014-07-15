function login(){
	if($.userId.value.length === 0 || $.password.value.length === 0){
		alert('ユーザ名またはパスワードを入力してください。');
		return;
	}
	var url = 'http://beak.sakura.ne.jp/freecycle/wp-login.php';
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

var data;
try{
	data = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'appData.txt').read());
	if(data.rememberme){
		$.userId.value = data.loginId;
		$.password.value = data.password;
		$.remembermeSwitch.value = data.rememberme;
	}
}catch(e){
	// do nothing
}
$.index.open();
