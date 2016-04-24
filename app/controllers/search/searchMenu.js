var searchBox = Ti.UI.createTextField({
	hintText: "キーワードで検索",
	width: "60%",
	color: "black"
});
searchBox.addEventListener("return", function(e){
	var keyword = this.value;
	if(!keyword){
		return;
	}
	var getKeywordSearchResultClient = Ti.Network.createHTTPClient({
		onload: function(e){
			var searchWin = Alloy.createController('searchBooks', {
				data: this.responseText,
				searchCondition: keyword
			}).getView();
			searchWin.open();
		}
	});
	getKeywordSearchResultClient.open("POST", Alloy.Globals.ajaxUrl);
	getKeywordSearchResultClient.send({
		action: "echo_posts_data_json",
		keyword: this.value
	});
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
				mainSection.add(createRow(subCategory.cat_name, subCategory.cat_ID));
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

function createRow(title, catId){
	var row = Ti.UI.createTableViewRow({
		title: title,
		catId: catId,
		color: "black"
	});
	row.addEventListener("click", function(e){
		var getSearchResultClient = Ti.Network.createHTTPClient({
			onload: function(e){
				var searchWin = Alloy.createController('searchBooks', {
					data: this.responseText,
					searchCondition: title
				}).getView();
				searchWin.open();
			}
		});
		getSearchResultClient.open("POST", Alloy.Globals.ajaxUrl);
		getSearchResultClient.send({
			action: "echo_posts_data_json",
			category: this.catId
		});
	});
	return row;
}
