var args = arguments[0] || {};
var url = args.url || Alloy.Globals.config.baseurl;
var loginId = args.loginId || '';
var twitterlogin = args.twitterlogin || false;
var mainWebView = $.mainTab.getView('mainWebView');
mainWebView.url = url;

// STATIC VALUES
var TAB_WEB = 0,
	TAB_EXIBITION = 1,
	TAB_MESSAGES = 2;


if(twitterlogin){
	mainWebView.addEventListener('load', jumpToTwitterLoginLink);
}

// configurataion of the back button of android
$.mainTabGroup.addEventListener("androidback", function(){
	if($.main.getActive()){
		mainWebView.goBack();
	}
});

// set message threads view
$.mainTabGroup.tabs[TAB_MESSAGES].window = Alloy.createController('messages/threadsView').getView();
Ti.App.addEventListener('thread_click', function(e){
	// alert(e.thread_id);
	$.mainTabGroup.tabs[TAB_MESSAGES].open(Alloy.createController('messages/messagesView',
		{thread_id: e.thread_id}).getView());
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

function jumpToTwitterLoginLink(){
	// get link of twitter login button
	var loginUrl = "";
	loginUrl = mainWebView.evalJS('
		document.getElementsByClassName("wpg_tw_btn")?document.getElementsByClassName("wpg_tw_btn")[0].href:""
	');
	if(loginUrl && loginUrl !== "undefined"){
		mainWebView.url = loginUrl;
	}
	mainWebView.removeEventListener('load', jumpToTwitterLoginLink);
}
