var args = arguments[0] || {};
var loginId = args.loginId || '';
var myPageWebView = $.myPageTab.getView('myPageWebView');
myPageWebView.url = 'http://127.0.0.1/wp/texchange/members/' + loginId;