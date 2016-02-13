function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function readBarcode() {
        picker = scanditsdk.createView({
            width: "100%",
            height: "100%"
        });
        picker.init(appKey, 0);
        picker.set2DScanningEnabled(false);
        picker.setCode39Enabled(false);
        picker.setCode128Enabled(false);
        picker.setItfEnabled(false);
        picker.setQrEnabled(false);
        picker.setDataMatrixEnabled(false);
        picker.setMsiPlesseyEnabled(false);
        picker.showSearchBar(true);
        picker.showToolBar(true);
        picker.setSuccessCallback(function(e) {
            var barcode = e.barcode;
            picker.stopScanning();
            var url = "http://texchange.sakura.ne.jp/static/inside.php";
            var searchClient = Ti.Network.createHTTPClient({
                onload: function() {
                    var res = this.responseText;
                    if (!res) {
                        showCannotFindItemDialog();
                        return;
                    }
                    var xml = Ti.XML.parseString(res);
                    if (null !== xml.getElementsByTagName("Title").item(0)) {
                        var title, midiumImageElements, image, author, isbn, priceElements, price, title = xml.getElementsByTagName("Title").item(0).getTextContent();
                        midiumImageElements = xml.getElementsByTagName("MediumImage").item(0).getChildNodes();
                        for (var i = 0; i < midiumImageElements.length; i++) {
                            var item = midiumImageElements.item(i);
                            if ("URL" === item.getNodeName()) {
                                image = item.getTextContent();
                                break;
                            }
                        }
                        author = xml.getElementsByTagName("Author").item(0) ? xml.getElementsByTagName("Author").item(0).getTextContent() : "";
                        isbn = barcode;
                        if (xml.getElementsByTagName("LowestNewPrice").item(0)) {
                            priceElements = xml.getElementsByTagName("LowestNewPrice").item(0).getChildNodes();
                            for (var i = 0; i < priceElements.length; i++) {
                                var item = priceElements.item(i);
                                if ("Amount" === item.getNodeName()) {
                                    price = item.getTextContent();
                                    break;
                                }
                            }
                        } else price = "";
                        Ti.API.info(author);
                        Ti.API.info(isbn);
                        Ti.API.info(price);
                        var confirmationWindow = Alloy.createController("exhibition/confirmation", {
                            title: title,
                            image: image,
                            author: author,
                            isbn: isbn,
                            price: price
                        }).getView();
                        confirmationWindow.addEventListener("close", function() {
                            picker.startScanning();
                        });
                        confirmationWindow.open();
                    } else showCannotFindItemDialog();
                },
                onerror: function(e) {
                    Ti.API.debug(e.error);
                    var errorDialog = Alloy.Globals.getConnectionErrorDialog();
                    errorDialog.addEventListener("click", function() {
                        picker.startScanning();
                    });
                    errorDialog.show();
                },
                timeout: 3e3
            });
            searchClient.open("GET", url + "?ISBN=" + e.barcode);
            searchClient.send();
        });
        picker.setCancelCallback(function() {
            closeScanner();
        });
        picker.restrictActiveScanningArea(true);
        picker.setScanningHotSpotHeight(.1);
        window.add(picker);
        window.addEventListener("open", function() {
            picker.setOrientation(window.orientation);
            picker.setSize(Ti.Platform.displayCaps.platformWidth, Ti.Platform.displayCaps.platformHeight);
            picker.startScanning();
        });
        window.open();
    }
    function showCannotFindItemDialog() {
        var errorDialog = Ti.UI.createAlertDialog({
            message: "商品データが取得できませんでした。"
        });
        errorDialog.addEventListener("click", function() {
            picker.startScanning();
        });
        errorDialog.show();
    }
    function showHelp() {
        var helpWindow = Alloy.createController("exhibition/help").getView();
        helpWindow.open({
            modal: true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "exhibition/exhibitionView";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.exhibitionWindow = Ti.UI.createWindow({
        id: "exhibitionWindow",
        title: "出品",
        backgroundColor: "white"
    });
    $.__views.exhibitionWindow && $.addTopLevelView($.__views.exhibitionWindow);
    $.__views.readBarcodeBtn = Ti.UI.createButton({
        borderRadius: 10,
        backgroundColor: "#fffacd",
        color: "#6495ed",
        id: "readBarcodeBtn",
        title: "バーコードを読み取る",
        top: "170",
        width: "150",
        height: "60"
    });
    $.__views.exhibitionWindow.add($.__views.readBarcodeBtn);
    readBarcode ? $.addListener($.__views.readBarcodeBtn, "click", readBarcode) : __defers["$.__views.readBarcodeBtn!click!readBarcode"] = true;
    $.__views.__alloyId20 = Ti.UI.createLabel({
        text: "使い方を見る",
        color: "#6495ed",
        top: "300",
        id: "__alloyId20"
    });
    $.__views.exhibitionWindow.add($.__views.__alloyId20);
    showHelp ? $.addListener($.__views.__alloyId20, "click", showHelp) : __defers["$.__views.__alloyId20!click!showHelp"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var scanditsdk = require("com.mirasense.scanditsdk");
    var appKey = Alloy.Globals.config.scandit.appKey;
    var picker;
    var window = Titanium.UI.createWindow({
        title: "バーコード読み取り",
        navBarHidden: true
    });
    var closeScanner = function() {
        if (null != picker) {
            picker.stopScanning();
            window.remove(picker);
            picker = null;
        }
        window.close();
    };
    __defers["$.__views.readBarcodeBtn!click!readBarcode"] && $.addListener($.__views.readBarcodeBtn, "click", readBarcode);
    __defers["$.__views.__alloyId20!click!showHelp"] && $.addListener($.__views.__alloyId20, "click", showHelp);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;