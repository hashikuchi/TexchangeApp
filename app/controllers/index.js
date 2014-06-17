function login(){
	var url = 'http://127.0.0.1/wp/texchange/wp-login.php';
	var loginClient = Ti.Network.createHTTPClient({
		onload: function(e){
			if(this.responseText.match('login_error')){
				// this.responseText <- 返ってきたHTML
				alert('error!');	
			}else{
				alert('login!');
			}
		},
		onerror: function(e){
			Ti.API.debug("error:" + e.error);
		},
		timeout: 5000
	});
	loginClient.open("POST", url); // GETはただデータ取ってくるだけ POSTは登録やログインなどセキュリティ、権限に関わる処理
	// GET http://texchg.com/index.php?username=hoge&pass=fuga
	// POST 通信そのものにパラメータを埋め込む
	// パラメータの設定
	loginClient.send({
		'log': $.userId.value, 
		'pwd': $.password.value
	});
}

$.index.open();
