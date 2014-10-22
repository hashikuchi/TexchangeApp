function goBack(){
	$.mainWebView.goBack();
}

function reloadWindow(){
	var url = $.mainWebView.getUrl();
	$.mainWebView.setUrl(url);
}