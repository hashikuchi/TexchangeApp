var args = arguments[0] || {};
var section = $.subCategoriesSection;
var mainCategory = args.mainCategory || {};
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
					categoryId: categories[i].term_id
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
getCategoryClient.open('POST', url);
getCategoryClient.send({
	'action': 'get_categories',
	'parent': mainCategory.categoryId
});

$.subCategories.addEventListener("itemclick", function(e){
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
			subCategory: {
				title: item.properties.title,
				index: e.itemIndex,
				categoryId: item.properties.categoryId
			}
		});
	}else{
		// remove checkmark
		item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
		// fire onselect event
		$.trigger('select',{
			subCategory: {
				title: "選択してください",
				index: -1
			}
		});
		section.updateItemAt(e.itemIndex, item);
	}
});
