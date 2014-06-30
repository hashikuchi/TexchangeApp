var scanditsdk = require('com.mirasense.scanditsdk');
var picker = scanditsdk.createView({
        width:'100%',
        height:'100%'
    });
var window = Titanium.UI.createWindow({  
        title:'バーコード読み取り',
        navBarHidden:true
});

function readBarcode(){
	var appKey = '3AU15vnIEeOTtjZAwaMb8kJj8PCFuC6h6olUpIUD8eI';
	// Create a window to add the picker to and display it. 
	picker = scanditsdk.createView({
        width:'100%',
        height:'100%'
    });
    picker.init(appKey, 0);
    
    picker.showSearchBar(true);
    // add a tool bar at the bottom of the scan view with a cancel button (iphone/ipad only)
    picker.showToolBar(true);
    // Set callback functions for when scanning succeedes and for when the 
    // scanning is canceled.
    picker.setSuccessCallback(function(e) {
    	var url = 'http://ancient-escarpment-4022.herokuapp.com/inside.php';
    	var searchClient = Ti.Network.createHTTPClient({
    		onload: function(e){
				var xml = Ti.XML.parseString(this.responseText);
				if(xml.getElementsByTagName('Title').item(0) === null){
					alert('商品データが取得できませんでした。');
				}else{
					alert('title:' + xml.getElementsByTagName('Title').item(0).getTextContent());
				}
    		},
			timeout: 5000
    	});
    	searchClient.open('GET', url + '?ISBN=' + e.barcode);
    	searchClient.send();
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
        else {
            picker.setOrientation(window.orientation);
        }
        
        picker.setSize(Ti.Platform.displayCaps.platformWidth, 
                       Ti.Platform.displayCaps.platformHeight);
        picker.startScanning();     // startScanning() has to be called after the window is opened. 
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
};