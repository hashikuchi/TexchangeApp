function login(){
	var url = 'http://beak.sakura.ne.jp/freecycle/';
	var loginClient = Ti.Network.createHTTPClient({
		onload: function(e){
			if(this.responseText.match('login_error')){
				alert('IDとパスワードの組合せが不正です。');	
			}else{
				var mainWin = Alloy.createController('main',{
					loginId: $.userId.value
				}).getView();
				mainWin.open();
			}
		},
		onerror: function(e){
			alert('通信エラーが発生しました。電波状況を確認してください。');
			Ti.API.debug("error:" + e.error);
		},
		timeout: 5000
	});
	loginClient.open("POST", url); 
	loginClient.send({
		'log': $.userId.value, 
		'pwd': $.password.value
	});
}

$.index.open();
