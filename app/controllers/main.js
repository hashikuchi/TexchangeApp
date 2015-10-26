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

// set message threads view
$.mainTabGroup.tabs[TAB_MESSAGES].window = Alloy.createController('messages/threadsView').getView();
Ti.App.addEventListener('thread_click', function(e){
	// alert(e.thread_id);
	$.mainTabGroup.tabs[TAB_MESSAGES].open(Alloy.createController('messages/messagesView',
		{thread_id: e.thread_id, tab_height: $.mainTabGroup.tabHeight}).getView());
});

// Save loggedin user id
var getLoggedinIdUrl = Alloy.Globals.config.baseurl + '/wp-admin/admin-ajax.php?action=bp_loggedin_user_id_from_ajax';
var getLoggedinIdClient = Ti.Network.createHTTPClient({
	onload: function(e){
		Alloy.Globals.loggedinId = this.responseText;
	},
	timeout: 5000
});
getLoggedinIdClient = Alloy.Globals.addCookieValueToHTTPClient(getLoggedinIdClient);
getLoggedinIdClient.open('GET', getLoggedinIdUrl);
getLoggedinIdClient.send();


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
