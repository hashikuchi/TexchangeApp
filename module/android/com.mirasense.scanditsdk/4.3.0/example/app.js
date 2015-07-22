/*
 * This code example illustrates how to integrate the Scandit SDK 
 * into your own application.  
 * 
 * IMPORTANT NOTE: Since we added support for landscape scanning
 * in the 1.1.0 version of our plugin, you will need to update the 
 * way you instantiate the Scandit SDK in your Titanium app. See
 * example below for more details. 
 *   
 * The example shows how to add a "start scan" button that invokes
 * the scan view. A Ti.Gesture.addEventListener is used to detect 
 * orientation changes and to update the Scandit SDK picker to 
 * update the camera feed accordingly. If you are intending to 
 * use portrait and landscape mode in your app, make sure that the 
 * supported interface orientations are set correctly in the XCode 
 * project. 
 * 
 * NOTE: You will need a Scandit SDK App Key! If you don't have one
 * yet, sign up at http://www.scandit.com. The Scandit SDK App Key
 * is then available from your Scandit SDK account. 
 * 
 * For more information, see http://www.scandit.com/support or
 * contact us at info@scandit.com. 
 */

// load the Scandit SDK module
var scanditsdk = require("com.mirasense.scanditsdk");

// disable the status bar for the camera view on the iphone and ipad
if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
    	Titanium.UI.iPhone.statusBarHidden = true;
	}


var picker;
// Create a window to add the picker to and display it. 
var window = Titanium.UI.createWindow({  
		title:'Scandit SDK',
		navBarHidden:true
});

// Sets up the scanner and starts it in a new window.
var openScanner = function() {
	// Instantiate the Scandit SDK Barcode Picker view
	picker = scanditsdk.createView({
		width:"100%",
		height:"100%"
	});
	// Initialize the barcode picker, remember to paste your own app key here.
	picker.init("enter Scandit SDK APP KEY here" - sign up at www.scandit.com, 0);


	picker.showSearchBar(true);
	// add a tool bar at the bottom of the scan view with a cancel button (iphone/ipad only)
	picker.showToolBar(true);

	// Set callback functions for when scanning succeedes and for when the 
	// scanning is canceled.
	picker.setSuccessCallback(function(e) {
		alert("success (" + e.symbology + "): " + e.barcode);
	});
	picker.setCancelCallback(function(e) {
		closeScanner();
	});

	window.add(picker);
	window.addEventListener('open', function(e) {
		// Adjust to the current orientation.
		// since window.orientation returns 'undefined' on ios devices 
		// we are using Ti.UI.orientation (which is deprecated and no longer 
	    // working on Android devices.)
		if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
    		picker.setOrientation(Ti.UI.orientation);
		}
		
		picker.setSize(Ti.Platform.displayCaps.platformWidth, 
					   Ti.Platform.displayCaps.platformHeight);
		picker.startScanning();		// startScanning() has to be called after the window is opened. 
	});
	window.open();
}

// Stops the scanner, removes it from the window and closes the latter.
var closeScanner = function() {
	if (picker != null) {
		picker.stopScanning();
		window.remove(picker);
	}
	window.close();
}

// Changes the picker dimensions and the video feed orientation when the
// orientation of the device changes.
Ti.Gesture.addEventListener('orientationchange', function(e) {
	window.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT, 
				   Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT];
	if (picker != null) {
		picker.setOrientation(e.orientation);
		picker.setSize(Ti.Platform.displayCaps.platformWidth, 
				Ti.Platform.displayCaps.platformHeight);
		// You can also adjust the interface here if landscape should look
		// different than portrait.
	}
});

// create start scanner button
var button = Titanium.UI.createButton({
	"width":200,
	"height": 80,
	"title": "start scanner"
});

button.addEventListener('click', function() {
	openScanner();
});

var rootWindow = Titanium.UI.createWindow({
    backgroundColor:'#000'
});
rootWindow.add(button);
rootWindow.open();