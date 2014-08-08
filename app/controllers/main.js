var args = arguments[0] || {};
var url = args.url || Alloy.Globals.BASE_URL;
var loginId = args.loginId || '';
var mainWebView = $.mainTab.getView('mainWebView');
mainWebView.url = url;