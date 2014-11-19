// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var configJSON;
var config;

configJSON = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'config.json');
// switch test mode and production mode
config = JSON.parse(configJSON.read().toString()).test;
// config = JSON.parse(configJSON.read().toString()).production;

Alloy.Globals.config = config;

Alloy.Globals.Facebook = require('facebook');

Alloy.Globals.getConnectionErrorDialog = function(){
	return Ti.UI.createAlertDialog({
		title: "通信エラー",
		message: "ネットワーク状況を確認してください。"
	});
};

Alloy.Globals.deviceToken = null;