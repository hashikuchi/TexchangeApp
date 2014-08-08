var args = arguments[0] || {};
var title = args.title;
var image = args.image;
$.itemTitle.setText(title);
$.itemImage.setImage(image);

function exhibit(){
	var url= Alloy.Globals.BASE_URL + '/wp-admin/admin-ajax.php';
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
