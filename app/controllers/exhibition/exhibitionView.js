var scanditsdk = require('com.mirasense.scanditsdk');
var appKey = Alloy.Globals.config.scandit.appKey;
var picker;

var window = Titanium.UI.createWindow({
    title: 'バーコード読み取り',
    navBarHidden: true
});

function readBarcode() {
    picker = scanditsdk.createView({
        width: '100%',
        height: '100%'
    });
    picker.init(appKey, 0);
    // disable unnecessary functions
    picker.set2DScanningEnabled(false);
    picker.setCode39Enabled(false);
    picker.setCode128Enabled(false);
    picker.setItfEnabled(false);
    picker.setQrEnabled(false);
    picker.setDataMatrixEnabled(false);
    picker.setMsiPlesseyEnabled(false);

    picker.showSearchBar(true);
    // add a tool bar at the bottom of the scan view with a cancel button (iphone/ipad only)
    picker.showToolBar(true);
    // Set callback functions for when scanning succeedes and for when the 
    // scanning is canceled.






    picker.setSuccessCallback(function (e) {
        var barcode = e.barcode;
        picker.stopScanning();
        var url = 'http://texchange.sakura.ne.jp/static/inside.php';
        var searchClient = Ti.Network.createHTTPClient({
            onload: function (e) {
                var res = this.responseText;
                if (!res) {
                    showCannotFindItemDialog();
                    return;
                }
                var xml = Ti.XML.parseString(res);
                if (xml.getElementsByTagName('Title').item(0) !== null) {
                    var title,
                        midiumImageElements,
                        image,
                        author,
                        isbn,
                        priceElements,
                        price,
                        title = xml.getElementsByTagName('Title').item(0).getTextContent();
                    midiumImageElements = xml.getElementsByTagName('MediumImage').item(0).getChildNodes();
                    for (var i = 0; i < midiumImageElements.length; i++) {
                        var item = midiumImageElements.item(i);
                        if (item.getNodeName() === 'URL') {
                            image = item.getTextContent();
                            break;
                        }
                    }
                    if (!xml.getElementsByTagName('Author').item(0)) {
                        author = "";
                    } else {
                        author = xml.getElementsByTagName('Author').item(0).getTextContent();
                    }
                    isbn = barcode;
                    if (!xml.getElementsByTagName('LowestNewPrice').item(0)) {
                        price = "";
                    } else {
                        priceElements = xml.getElementsByTagName('LowestNewPrice').item(0).getChildNodes();
                        for (var i = 0; i < priceElements.length; i++) {
                            var item = priceElements.item(i);
                            if (item.getNodeName() === 'Amount') {
                                price = item.getTextContent();
                                break;
                            }
                        }
                    }
                    Ti.API.info(author);
                    Ti.API.info(isbn);
                    Ti.API.info(price);
                    /* createController creates object using a model of first argument */
                    var confirmationWindow = Alloy.createController('exhibition/confirmation', {
                        title: title,
                        image: image,
                        author: author,
                        isbn: isbn,
                        price: price,
                    }).getView();
                    confirmationWindow.addEventListener('close', function (e) {
                        picker.startScanning();
                    });
                    confirmationWindow.open();
                } else {
                    showCannotFindItemDialog();
                }
            },
            onerror: function (e) {
                Ti.API.debug(e.error);
                var errorDialog = Alloy.Globals.getConnectionErrorDialog();
                errorDialog.addEventListener('click', function (e) {
                    picker.startScanning();
                });
                errorDialog.show();
            },
            timeout: 3000
        });
        /* everything begins with following */
        searchClient.open('GET', url + '?ISBN=' + e.barcode);
        searchClient.send();
    });
    picker.setCancelCallback(function (e) {
        closeScanner();
    });

    // Restrict the area in which the recognition actively searches for barcodes.
    // This is to avoid the additional scanning in case that multiple barcodes are in one screen
    picker.restrictActiveScanningArea(true);
    // Reduce the active area to 10% of the display's height.
    picker.setScanningHotSpotHeight(0.1);

    window.add(picker);
    window.addEventListener('open', function (e) {
        // Adjust to the current orientation.
        // since window.orientation returns 'undefined' on ios devices
        // we are using Ti.UI.orientation (which is deprecated and no longer
        // working on Android devices.)
        if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
            picker.setOrientation(Ti.UI.orientation);
        } else {
            picker.setOrientation(window.orientation);
        }

        picker.setSize(Ti.Platform.displayCaps.platformWidth,
            Ti.Platform.displayCaps.platformHeight);
        picker.startScanning(); // startScanning() has to be called after the window is opened.
    });
    window.open();
}







// Stops the scanner, removes it from the window and closes the latter.
var closeScanner = function () {
    if (picker != null) {
        picker.stopScanning();
        window.remove(picker);
        picker = null; // clear the picker object
    }
    window.close();
};

function showCannotFindItemDialog() {
    var errorDialog = Ti.UI.createAlertDialog({
        message: "商品データが取得できませんでした。"
    });
    errorDialog.addEventListener('click', function (e) {
        picker.startScanning();
    });
    errorDialog.show();
}

function showHelp() {
    var helpWindow = Alloy.createController('exhibition/help').getView();
    helpWindow.open({
        modal: true,
        modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
        modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
    });
}
