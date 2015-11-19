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

var getUserLoginInfoClient = Ti.Network.createHTTPClient({
	onload: function(e){
		var userLoginInfo = JSON.parse(this.responseText);
		$.mainTabGroup.title += userLoginInfo.data.display_name;
	},
	onerror: function(e){
			Ti.API.debug(e.error);
			var errorDialog = Alloy.Globals.getConnectionErrorDialog();
			errorDialog.show();
		},
		timeout: 5000
});
getUserLoginInfoClient = Alloy.Globals.addCookieValueToHTTPClient(getUserLoginInfoClient);
getUserLoginInfoClient.open('POST', Alloy.Globals.config.baseurl + '/wp-admin/admin-ajax.php');
getUserLoginInfoClient.send({
	'action': 'get_login_user_info'
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
