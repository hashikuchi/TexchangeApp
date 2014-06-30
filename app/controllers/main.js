var args = arguments[0] || {};
var loginId = args.loginId || '';
var myPageWebView = $.myPageTab.getView('myPageWebView');
myPageWebView.url = 'http://beak.sakura.ne.jp/freecycle/members/' + loginId;