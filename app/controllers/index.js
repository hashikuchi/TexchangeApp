function openSearchBooksWindow(){
	var getSearchResultClient = Ti.Network.createHTTPClient({
		onload: function(e){
			var searchWin = Alloy.createController('searchBooks', {data: this.responseText}).getView();
			searchWin.open();
		}
	});
	getSearchResultClient.open("POST", Alloy.Globals.ajaxUrl);
	getSearchResultClient.send({
		action: "echo_posts_data_json_with_image_url_custom_properties"
	});
}

openSearchBooksWindow();