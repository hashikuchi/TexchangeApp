var args = arguments[0] || {};

// メッセージ一覧表示用のビュー
var scrollView = Titanium.UI.createScrollView({
	backgroundColor:'#f5f5f5',
	contentWidth: 'auto',
	contentHeight: Ti.UI.SIZE,
	width: 'auto',
	top:0,
	bottom: 60,
	showVerticalScrollIndicator:true,
	layout: 'vertical'
});

//新規メッセージ送信フォーム用のビュー
var newMessageView = Ti.UI.createView({
	backgroundColor:'#F4FFFD',
	width: 'auto',
	bottom: 0,
	height:60
});

var newMessageArea = Titanium.UI.createTextArea({
	appearance: Ti.UI.KEYBOARD_APPEARANCE_ALERT,
	borderColor: '#bbb',
	borderWidth: 2,
	bottom: 5,
	color: '#336699',
	enableReturnKey: true,
	height: 50,
	keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
	left: 10,
	right: 60,
	scrollabl: true,
	suppressReturn:false,
	textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	width: Ti.UI.FILL
});

var sendButton = Ti.UI.createButton({
	buttom: 5,
	width: 50,
	title: '送信',
	right: 10
});

newMessageView.add(newMessageArea);
newMessageView.add(sendButton);

/*
 * イベント定義 (define events)
 */

// キーボードを表示したとき、メッセージフィールドを(キーボードの高さ-タブの高さ)分持ち上げる
// フォーカスが外れたとき、フィールドを一番下に戻す
// lift the text field by the hight of the keyboard
Ti.App.addEventListener("keyboardframechanged", function(e){
	if(Ti.App.keyboardVisible){
		$.messagesWindow.bottom = (e.keyboardFrame.height - args.tab_height);
	}else{
		$.messagesWindow.bottom = 0;
	}
});

// 送信ボタン押下時、内容を新しいメッセージとして追加
sendButton.addEventListener("click", function(e){
	var content = newMessageArea.value.trim();
	if(content.length <= 0) return;
	addMyNewMessage(content);
	
	var time = new Date();
	addMyTimeLabel(time.getHours() + ":" + time.getMinutes());
	
	// virtual messages...
	addTheirNewMessage("返信ありがとうございます！\nとかなんとか");
	addTheirTimeLabel(time.getHours() + ":" + time.getMinutes());
	
	newMessageArea.value = ""; // clear the value
	newMessageArea.blur();
	scrollView.scrollToBottom();
});

// スクロールビューにフォーカスしたとき、テキストフィールドからフォーカスを外す
// Fire the blur event when the scroll view is focused
scrollView.addEventListener("touchstart", function(e){
	newMessageArea.blur();
});

$.messagesWindow.add(scrollView);
$.messagesWindow.add(newMessageView);

var url= Alloy.Globals.config.baseurl + '/wp-admin/admin-ajax.php?action=get_messages_JSON_from_ajax&thread_id=' + args['thread_id'];
var loggedId = Alloy.Globals.loggedinId;
var getMessagesClient = Ti.Network.createHTTPClient({
	onload:function(e){
		var messages = JSON.parse(this.responseText);
		for(var i = 0; i < messages.length; i++){
			var message = messages[i];
			if(loggedId == message.sender_id){
				addMyNewMessage(message.content, message.avatar_url);
			}else{
				addTheirNewMessage(message.content, message.sender_name, message.avatar_url);
			}
			// lat, lngプロパティが定義されていたら、地図を表示する
			if(message.lat && message.lng){
				// マーカー表示あり、ズームレベル11
				var url = "http://maps.google.com/maps?z=18&ll="+message.lat+","+message.lng+"&q="+message.lat+","+message.lng;
				var mapLink = Ti.UI.createLabel({
					text: "取引場所の地図を表示",
					font: {fontSize: 12},
					color: "#0000cd"
				});
				mapLink.addEventListener("touchstart", function(e){
					this.color = "#00bfff";
					Ti.Platform.openURL(url);
				});
				mapLink.addEventListener("touchend", function(e){
					this.color = "#0000cd";
				});
				scrollView.add(mapLink);
			}
		}
	},
	
	onerror:function(e){
		Ti.API.info("error");
	},
	timeout: 5000
});

getMessagesClient = Alloy.Globals.addCookieValueToHTTPClient(getMessagesClient);
getMessagesClient.open('GET', url);
getMessagesClient.send();

function addNewMessage(content, name, avatarUrl){
	var messageParams = {
		color:'#336699',
		value: content,
		backgroundColor: 'transparent',
		backgroundLeftCap: 20,
		backgroundTopCap: 0,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		editable: false,
		scrollable: false
	};
	var imageParams = {
		height: 30,
		width: 30,
		top:5
	};
	var area = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: 'auto'
	});

	if(name){
		messageParams.left = 50;
		messageParams.top = 18;
		messageParams.backgroundImage = 'images/chat/chat_others.png';
		area.add(Ti.UI.createLabel({
			color: "#FFF",
			text: name,
			left: 50,
			top: 5,
			font: {fontSize: 11}
		}));
		area.add(Ti.UI.createImageView({
			image: avatarUrl,
			height: 30,
			width: 30,
			left: 10,
			top: 18
		}));
	}else{
		messageParams.right = 10;
		messageParams.backgroundImage = 'images/chat/chat_mine.png';
	}
	
	var newText = Titanium.UI.createTextArea(messageParams);

	area.add(newText);	
	scrollView.add(area);
}

function addTimeLabel(time, mine){
	var params = {
		color: "#FFF",
		text: time,
		font: {fontSize: 9}
	};
	
	if(mine === true){
		params.right = 10;
	}else{
		params.left = 50;
	}
		
	var label = Ti.UI.createLabel(params);
	scrollView.add(label);
}


function addMyNewMessage(content, avatarUrl){
	addNewMessage(content, "", avatarUrl);
}


function addTheirNewMessage(content, name, avatarUrl){
	addNewMessage(content, name, avatarUrl);
}

function addMyTimeLabel(time){
	addTimeLabel(time, true);
}

function addTheirTimeLabel(time){
	addTimeLabel(time, false);
}
