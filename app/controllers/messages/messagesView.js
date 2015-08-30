var scrollView = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',
	top:0,
	showVerticalScrollIndicator:true,
	showHorizontalScrollIndicator:true,
	zIndex: -1
});

var messagesView = Ti.UI.createView({
	backgroundColor:'#336699',
	width: 'auto',
	height:2000
});

scrollView.add(messagesView);

var tf1 = Titanium.UI.createTextArea({
	color:'#336699',
	top:10,
	left:10,
	hintText:'hogehoge',
	backgroundColor: 'transparent',
	backgroundImage: 'images/chat/chat_others.png',
	backgroundLeftCap: 20,
	backgroundTopCap: 0,
	paddingLeft: 10,
	textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	editable: false
});

var tf2 = Titanium.UI.createTextArea({
	color:'#336699',
	top:50,
	right:10,
	value:'hogehoge\nfoobar\n',
	backgroundColor: 'transparent',
	backgroundImage: 'images/chat/chat_mine.png',
	backgroundLeftCap: 20,
	backgroundTopCap: 0,
	paddingRight: 10,
	textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
	editable:false
});

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
	var newText = Titanium.UI.createTextArea({
		color:'#336699',
		top:100,
		right:10,
		value: newMessageArea.value,
		backgroundColor: 'transparent',
		backgroundImage: '/images/chat/chat_mine.png',
		backgroundLeftCap: 20,
		backgroundTopCap: 0,
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		editable: false
	});
	messagesView.add(newText);
	newMessageArea.blur();
});

messagesView.add(tf1);
messagesView.add(tf2);
$.messagesWindow.add(scrollView);
$.messagesWindow.add(newMessageView);