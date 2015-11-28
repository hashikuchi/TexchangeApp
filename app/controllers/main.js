var args = arguments[0] || {};
var url = args.url || Alloy.Globals.config.baseurl;
var loginId = args.loginId || '';
var mainWebView = $.mainTab.getView('mainWebView');
mainWebView.url = url;

// configurataion of the back button of android
$.mainTabGroup.addEventListener("androidback", function () {
    if ($.main.getActive()) {
        mainWebView.goBack();
    }
});

var getUserLoginInfoClient = Ti.Network.createHTTPClient({
    onload: function (e) {
        var userLoginInfo = JSON.parse(this.responseText);
        $.mainTabGroup.title += userLoginInfo.data.display_name;
    },
    onerror: function (e) {
        Ti.API.debug(e.error);
        var errorDialog = Alloy.Globals.getConnectionErrorDialog();
        errorDialog.show();
    },
    timeout: 5000
});
// Cookieのセットが何か悪さをしてユーザ名が取れない場合がある。原因要調査
//getUserLoginInfoClient = Alloy.Globals.addCookieValueToHTTPClient(getUserLoginInfoClient);
getUserLoginInfoClient.open('POST', Alloy.Globals.config.baseurl + '/wp-admin/admin-ajax.php');
getUserLoginInfoClient.send({
    'action': 'get_login_user_info'
});

// configuration of reload function for android
function reloadWindowAndroid() {
    if ($.main.getActive()) {
        var url = mainWebView.getUrl();
        mainWebView.setUrl(url);
    }
}

function openTroubleshootingWindow() {
    var troubleshootingWindow = Alloy.createController('troubleshooting').getView();
    troubleshootingWindow.open({
        modal: true,
        modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
        modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
    });
}

// ログアウト処理です。
function onLogoutClick(){
	var confirm = Ti.UI.createAlertDialog({
		title: "ログアウトします",
		message: "よろしいですか？",
		cancel: 0,
		confirm: 1,
		buttonNames: ["キャンセル", "はい"]
	});
	confirm.addEventListener("click", function(e){
		if (e.index === e.source.confirm){
			logout();
    	}
	});
	confirm.show();
}

function logout(){
	// アプリからのログアウト
	// ログイン情報を消す
	try{
		var loginData = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'appData.txt');
		if(loginData){
			loginData.deleteFile();
			Ti.API.info("del");
		}
	}catch(e){
		Ti.API.warn(e);
	}

	// facebookからログアウト
	Alloy.Globals.Facebook.logout();
	// twitter からログアウト
	Alloy.Globals.Twitter.logout();
	// Cookieをすべて消す
	Ti.Network.removeAllHTTPCookies();

	// Texchange の Webからログアウト
	var logoutClient = Ti.Network.createHTTPClient({
		onload: function(){
			Ti.API.info(this.responseText);
			var loClient = Ti.Network.createHTTPClient({
				onload: function(){
					Ti.API.info("logout success!");
				},				
				onerror: function(){
					Ti.API.info("logout error");
				},
				timeout: 5000
			});
			loClient = Alloy.Globals.addCookieValueToHTTPClient(loClient);
			loClient.open("POST", Alloy.Globals.config.baseurl + '/wp-login.php');
			loClient.send({
				"action": "logout",
				"_wpnonce": this.responseText
			});
		},
		onerror: function(){
        	Ti.API.debug(e.error);
		},
		timeout: 5000
	});
	logoutClient = Alloy.Globals.addCookieValueToHTTPClient(logoutClient);
	logoutClient.open("POST",  Alloy.Globals.ajaxUrl);
	logoutClient.send({
		"action": "get_nonce_from_app",
		"nonce_action": "log-out"
	});

	// 今の画面を閉じてindexに遷移する
	var index = Alloy.createController('index').getView();
	index.open();
	$.mainTabGroup.close();
}

