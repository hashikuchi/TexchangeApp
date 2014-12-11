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