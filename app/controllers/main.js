var args = arguments[0] || {};
var url = args.url || Alloy.Globals.config.baseurl;
var loginId = args.loginId || '';
var mainWebView = $.mainTab.getView('mainWebView');
mainWebView.url = url;

// configurataion of the back button of android
$.mainTabGroup.addEventListener("androidback", function(){
	if($.main.getActive()){
		mainWebView.goBack();
	}
});

// configuration of reload function for android
function reloadWindowAndroid(){
	if($.main.getActive()){
		var url = mainWebView.getUrl();
		mainWebView.setUrl(url);
	}
}

function openTroubleshootingWindow(){
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
	var loginData = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'appData.txt');
	if(loginData){
		loginData.deleteFile();
		Ti.API.info("del");
	}

	// facebookからログアウト
	var facebook = Alloy.Globals.Facebook;
	facebook.logout();

	// 今の画面を閉じてindexに遷移する
	var index = Alloy.createController('index').getView();
	index.open();
	$.mainTabGroup.close();
}

