var threadsList = Ti.UI.createListView();
var section = Ti.UI.createListSection();
var sections = [];
var threads = [];

threadsList.addEventListener("itemclick", function(e){
	var item = section.getItemAt(e.itemIndex);
	Ti.App.fireEvent('thread_click', {thread_id: item.properties.thread_id});
});

// get threads list JSON
var url= Alloy.Globals.config.baseurl + '/wp-admin/admin-ajax.php?action=get_threads_JSON_from_ajax';
var getThreadsClient = Ti.Network.createHTTPClient({
	onload: function(e){
		var listItems = [];
		var threads = JSON.parse(this.responseText);
		for(var i=0;i<threads.length;i++){
			var thread = threads[i];
			var backgroundColor, font;

			if(thread.unread === true){
				backgroundColor = '#fff9db';
				font = {fontWeight: 'bold'};
			}else{
				backgroundColor = '#f5f5f5';
				font = {fontWeight: 'normal'};
			}

			var listItem = 	{
				template:Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE,
				properties: {
					title: thread.subject,
					subtitle: "送信元: " + thread.from + "   " + thread.last_post_date,
					thread_id: thread.thread_id,
					backgroundColor: backgroundColor,
					font: font,
					height: Ti.UI.FILL
				}
			};
			listItems.push(listItem);
		}
		section.setItems(listItems);
		sections.push(section);
		threadsList.setSections(sections);
	},
	onerror: function(e){
		Ti.API.debug(e.error);
		var errorDialog = Alloy.Globals.getConnectionErrorDialog();
		errorDialog.show();
	},
	timeout: 5000
});
getThreadsClient = Alloy.Globals.addCookieValueToHTTPClient(getThreadsClient);
getThreadsClient.open('GET', url);
getThreadsClient.send();

// section.setItems(threads);
// sections.push(section);
// threadsList.setSections(sections);
$.threadsWindow.add(threadsList);
