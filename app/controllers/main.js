var args = arguments[0] || {};
var loginId = args.loginId || '';
var myPageWebView = $.myPageTab.getView('myPageWebView');
myPageWebView.url = Alloy.Globals.BASE_URL +  '/members/' + loginId;
