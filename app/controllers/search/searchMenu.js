var searchBox = Ti.UI.createTextField({
	hintText: "キーワードで検索",
	width: "60%",
	color: "black"
});
searchBox.addEventListener("return", function(e){
	var searchWin = Alloy.createController('searchBooks').getView();
	searchWin.open();
});
 
var getCategoriesTreeClient = Ti.Network.createHTTPClient({
	onload: function(e){
		// Get categoris data, and create a categories table.
		var categoriesTree = JSON.parse(this.responseText);
		var header = Ti.UI.createTableViewSection({headerTitle: "カテゴリから検索"});		
		var categoriesData = [header];
		
		for(var i=0;i<categoriesTree.length;i++){
			var mainCategory = categoriesTree[i];
			var mainSection = Ti.UI.createTableViewSection({headerTitle: mainCategory.cat_name});
			var subCategories = mainCategory.subcategories;
			for(var elm in subCategories){
				var subCategory = subCategories[elm];
				mainSection.add(createRow(subCategory.cat_name));
			}
			categoriesData.push(mainSection);
		}
		var categoriesTable = Ti.UI.createTableView({data:categoriesData});
		categoriesTable.top = 70;
		
		$.searchMenuWin.add(categoriesTable);
	}
});

getCategoriesTreeClient.open("POST", Alloy.Globals.ajaxUrl);
getCategoriesTreeClient.send({
	action: "echo_categories_tree_json"
});

$.searchMenuWin.add(Alloy.Globals.createCommonHeader([searchBox]));

function createRow(title){
	var row = Ti.UI.createTableViewRow({
		title: title,
		color: "black"
	});
	row.addEventListener("click", function(e){
		var searchWin = Alloy.createController('searchBooks').getView();
		searchWin.open();
	});
	return row;
}
