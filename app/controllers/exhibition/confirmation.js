var args = arguments[0] || {};
var title = args.title;
var image = args.image;

var mainCategory = {};
var subCategory = {};
var os = Ti.Platform.getOsname();

$.itemTitle.setText(title);
$.itemImage.setImage(image);

$.categoriesView.addEventListener("itemclick", function(e){
	var win;
	var detailWindow;
	if(e.itemIndex == 0){
		openCategoryWindow("mainCategories", {
			selectedCategory: mainCategory
		},
		function(e){
			updateMainCategory(e.mainCategory);
			updateSubCategory(e.subCategory);
		});
	}else if(e.itemIndex == 1){
		// return if main category is not selected
		if(mainCategory.categoryId < 0 || mainCategory.categoryId == null){
			Ti.UI.createAlertDialog({
				title: "大学を選択してください",
			}).show();
			return;
		}		
		openCategoryWindow("subCategories", {
			mainCategory: mainCategory,
			selectedCategory: subCategory
		},
		function(e){
			updateSubCategory(e.subCategory);
		});
	}
});

function exhibit(){
	// error check
	// return if subcategory is not selected
	if(subCategory.categoryId < 0 || subCategory.categoryId == null){
		Ti.UI.createAlertDialog({
			title: "学部を選択してください",
			message: "大学と学部を両方選択する必要があります。"
		}).show();
		return;
	}
	
	var url= Alloy.Globals.config.baseurl + '/wp-admin/admin-ajax.php';
	var exhibitClient = Ti.Network.createHTTPClient({
		onload: function(e){
			var dialog = Ti.UI.createAlertDialog({
				message: this.responseText
			});
			dialog.addEventListener('click', function(e){
				cancel();
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
		'image_url': image,
		'category': subCategory.categoryId
	});
}

function onExhibitionButtonClicked(){
	$.exhibit.enabled = false;
	exhibit();
	$.exhibit.enabled = true;
}

function openCategoryWindow(name, args, callback){
	var win = Alloy.createController('exhibition/categories/' + name, args);
	var detailWindow = win.getView();
	if(os == "iphone"){
		$.confirmationRootWindow.openWindow(detailWindow);		
	}else{
		detailWindow.open();	
	}
	win.on('select', callback);	
}

function updateMainCategory(main){
	mainCategory = main; // update global variable
	var item = $.categoriesSection.getItemAt(0);
	if(os == "iphone"){
		item.properties.subtitle = main.title;
	}else{
		item.properties.title = main.title;
	}
	$.categoriesSection.updateItemAt(0, item);
}

function updateSubCategory(sub){
	subCategory = sub; // update global variable
	var item = $.categoriesSection.getItemAt(1);
	if(os == "iphone"){
		item.properties.subtitle = sub.title;
	}else{
		item.properties.title = sub.title;
	}
	$.categoriesSection.updateItemAt(1, item);
}

function cancel(){
	if(os == "iphone"){
		$.confirmationRootWindow.close();
	}else{
		$.confirmationWindow.close();
	}
}