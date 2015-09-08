// メッセージ一覧表示用のビュー
var scrollView = Titanium.UI.createScrollView({
	backgroundColor:'#336699',
	contentWidth: 'auto',
	contentHeight: Ti.UI.SIZE,
	width: 'auto',
	top:0,
	bottom: 60,
	showVerticalScrollIndicator:true,
	layout: 'vertical'
});

var image1 = Ti.UI.createImageView({
	image: 'images/menus/help-48.png',
	height: 30,
	width: 30,
	left:10,
	top:18
});

var tf1 = Titanium.UI.createTextArea({
	color:'#336699',
	left:50,
	top:18,
	value:'くださいリクエストが承認されました！',
	backgroundColor: 'transparent',
	backgroundImage: 'images/chat/chat_others.png',
	backgroundLeftCap: 20,
	backgroundTopCap: 0,
	paddingLeft: 10,
	textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	editable: false
});

var html1 = Ti.UI.createWebView({
	html: "<html><body><p>ありがとうございます</p></body></html>",
	left: 50,
	top: 18,
	height: Ti.UI.SIZE,
	//width: Ti.UI.SIZE,
	backgroundColor: 'transparent',
	backgroundImage: 'images/chat/chat_others.png',
	backgroundLeftCap: 20,
	backgroundTopCap: 0
});

var label1 = Ti.UI.createLabel({
	color: "#FFF",
	text: "12:34",
	left: 50,
	font: {fontSize: 9}
});

var label2 = Ti.UI.createLabel({
	color: "#FFF",
	text: "テストユーザ",
	left: 50,
	top: 5,
	font: {fontSize: 11}
});

var marea1 = Ti.UI.createView({
	height: Ti.UI.SIZE,
	width: 'auto'
});

marea1.add(image1);
marea1.add(label2);
//marea1.add(html1);
marea1.add(tf1);

// 新規メッセージ送信フォーム用のビュー
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

// キーボードを表示したとき、メッセージフィールドをキーボードの高さ分持ち上げる
// フォーカスが外れたとき、フィールドを一番下に戻す
// lift the text field by the hight of the keyboard
Ti.App.addEventListener("keyboardframechanged", function(e){
	if(Ti.App.keyboardVisible){
		newMessageView.bottom = e.keyboardFrame.height;
	}else{
		newMessageView.bottom = 0;
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

// scrollView.add(image1);
// scrollView.add(tf1);

scrollView.add(marea1);
scrollView.add(label1);
$.messagesWindow.add(scrollView);
$.messagesWindow.add(newMessageView);

function addNewMessage(content, mine){
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

	if(mine === true){
		messageParams.right = 10;
		messageParams.backgroundImage = 'images/chat/chat_mine.png';
	}else{
		messageParams.left = 50;
		messageParams.top = 18;
		messageParams.backgroundImage = 'images/chat/chat_others.png';
		area.add(Ti.UI.createLabel({
			color: "#FFF",
			text: "テストユーザ",
			left: 50,
			top: 5,
			font: {fontSize: 11}
		}));
		area.add(Ti.UI.createImageView({
			image: 'images/menus/help-48.png',
			height: 30,
			width: 30,
			left: 10,
			top: 18
		}));
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


function addMyNewMessage(content){
	addNewMessage(content, true);
}


function addTheirNewMessage(content){
	addNewMessage(content, false);
}

function addMyTimeLabel(time){
	addTimeLabel(time, true);
}

function addTheirTimeLabel(time){
	addTimeLabel(time, false);
}
