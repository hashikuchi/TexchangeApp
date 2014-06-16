function login(){
	var url = 'http://127.0.0.1/wp/texchange/wp-login.php';
	var loginClient = Ti.Network.createHTTPClient({
		onload: function(e){
			if(this.responseText.match('login_error')){
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
	loginClient.open("POST", url);
	loginClient.send({
		'log': $.userId.value,
		'pwd': $.password.value
	});
}

$.index.open();
