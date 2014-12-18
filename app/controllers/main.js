var args = arguments[0] || {};
var url = args.url || Alloy.Globals.config.baseurl;
var loginId = args.loginId || '';
var twitterlogin = args.twitterlogin || false;
var mainWebView = $.mainTab.getView('mainWebView');
mainWebView.url = url;

if(twitterlogin){
	mainWebView.addEventListener('load', jumpToTwitterLoginLink);
}

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

function jumpToTwitterLoginLink(){
	// get link of twitter login button
	var loginUrl = "";
	loginUrl = mainWebView.evalJS('
		document.getElementsByClassName("wpg_tw_btn")?document.getElementsByClassName("wpg_tw_btn")[0].href:""
	');
	if(loginUrl && loginUrl !== "undefined"){
		mainWebView.url = loginUrl;
	}else if(loginUrl === "undefined"){
		Ti.UI.createAlertDialog({
			title: "ログイン処理は完了していません！",
			message: "「Twitterでログイン」ボタンを押してください。"
		}).show();
	}
	mainWebView.removeEventListener('load', jumpToTwitterLoginLink);
}
