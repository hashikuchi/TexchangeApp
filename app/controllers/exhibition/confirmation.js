var args = arguments[0] || {};
var title = args.title;
var image = args.image;
$.itemTitle.setText(title);
$.itemImage.setImage(image);

function exhibit(){
	var url= Alloy.Globals.config.baseurl + '/wp-admin/admin-ajax.php';
	var exhibitClient = Ti.Network.createHTTPClient({
		onload: function(e){
			var dialog = Ti.UI.createAlertDialog({
				message: this.responseText
			});
			dialog.addEventListener('click', function(e){
				$.confirmationWindow.close();
			});
			dialog.show();
		},
		onerror: function(e){
			Ti.API.debug(e.error);
			var errorDialog = Alloy.Globals.getConnectionErrorDialog();
			errorDialog.show();
		},
		timeout: 5000
	});
	
	// Set system cookie value into http cookie store for android
	// This is necessary for social login case
	// addHTTPcookie method does not work at here
	if(Ti.Platform.getOsname() == 'android'){
		var systemCookies = Ti.Network.getSystemCookies(Alloy.Globals.config.domain, Alloy.Globals.config.cookiepath, null);
		var cookiestrings = "";
		if(systemCookies){
			systemCookies.forEach(function(cookie){
				cookiestrings += '; ' + cookie.name + '=' + cookie.value;
				Ti.API.info('name:' + cookie.name + ' value:' + cookie.value);
			});
			exhibitClient.setRequestHeader('Cookie:', cookiestrings);
		}
	}
	
	exhibitClient.open('POST', url);
	exhibitClient.send({
		'action': 'exhibit_from_app',
		'item_name': title,
		'image_url': image
	});
}

function cancel(){
	$.confirmationWindow.close();
}
