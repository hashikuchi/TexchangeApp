var args = arguments[0] || {};
var section = $.mainCategoriesSection;
var selected = args.selectedCategory || {};

function checkItem(item, index){
	item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
	section.updateItemAt(index, item);	
}

function uncheckItem(item, index){
	item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
	section.updateItemAt(index, item);	
}

var url= Alloy.Globals.config.baseurl + '/wp-admin/admin-ajax.php';
var getCategoryClient = Ti.Network.createHTTPClient({
	onload: function(e){
		var categories = Array.prototype.slice.apply(JSON.parse(this.responseText));
		var items=[];		
		for (var i=0; i < categories.length; i++){
			items.push({
				properties: {
					title: categories[i].name,
					accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE,
					categoryId: categories[i].term_id,
					color: "black"
				}
			});
		}
		section.appendItems(items);
		if(selected.index >= 0){
		var selectedOne = section.getItemAt(selected.index);
			checkItem(selectedOne, selected.index);
		}
	},
	onerror: function(e){
		Ti.API.debug(e.error);
		var errorDialog = Alloy.Globals.getConnectionErrorDialog();
		errorDialog.show();
	},
	timeout: 5000
});

getCategoryClient = Alloy.Globals.addCookieValueToHTTPClient(getCategoryClient);
getCategoryClient.open('POST', url);
getCategoryClient.send({
	'action': 'get_categories',
	'parent': 0
});

$.mainCategories.addEventListener("itemclick", function(e){
	var items = section.getItems();
	var item = section.getItemAt(e.itemIndex);
	if(item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_NONE){
		// remove checkmarks from unselected items
		for(var i=0; i<items.length; i++){
			if(i != e.itemIndex){
				uncheckItem(section.getItemAt(i), i);
			}
		}
		
		// set checkmark
		checkItem(item, e.itemIndex);

		// fire onselect event
		$.trigger('select',{
			mainCategory: {
				title: item.properties.title,
				index: e.itemIndex,
				categoryId: item.properties.categoryId
			},
			subCategory: {
				title: "選択してください",
				index: -1
			}
		});
	}else{
		// remove checkmark
		item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
		// fire onselect event
		$.trigger('select',{
			mainCategory: {
				title: "選択してください",
				index: -1
			},
			subCategory: {
				title: "選択してください",
				index: -1
			}
		});
		section.updateItemAt(e.itemIndex, item);
	}
});
