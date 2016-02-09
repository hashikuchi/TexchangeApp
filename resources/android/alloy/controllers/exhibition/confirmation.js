function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function exhibit() {
        $.exhibit.removeEventListener("click", exhibit);
        if (subCategory.categoryId < 0 || null == subCategory.categoryId) {
            Ti.UI.createAlertDialog({
                title: "学部を選択してください",
                message: "大学と学部を両方選択する必要があります。"
            }).show();
            $.exhibit.addEventListener("click", exhibit);
            return;
        }
        var url = Alloy.Globals.config.baseurl + "/wp-admin/admin-ajax.php";
        var exhibitClient = Ti.Network.createHTTPClient({
            onload: function() {
                var dialog = Ti.UI.createAlertDialog({
                    message: this.responseText
                });
                dialog.addEventListener("click", function() {
                    cancel();
                });
                dialog.show();
            },
            onerror: function(e) {
                Ti.API.debug(e.error);
                var errorDialog = Alloy.Globals.getConnectionErrorDialog();
                errorDialog.show();
                $.exhibit.addEventListener("click", exhibit);
            },
            timeout: 5e3
        });
        if ("android" == Ti.Platform.getOsname()) {
            var systemCookies = Ti.Network.getSystemCookies(Alloy.Globals.config.domain, Alloy.Globals.config.cookiepath, null);
            var cookiestrings = "";
            if (systemCookies) {
                systemCookies.forEach(function(cookie) {
                    cookiestrings += "; " + cookie.name + "=" + cookie.value;
                    Ti.API.info("name:" + cookie.name + " value:" + cookie.value);
                });
                exhibitClient.setRequestHeader("Cookie:", cookiestrings);
            }
        }
        exhibitClient.open("POST", url);
        exhibitClient.send({
            action: "exhibit_from_app",
            item_name: title,
            author: author,
            ISBN: isbn,
            price: price,
            image_url: image,
            category: subCategory.categoryId
        });
    }
    function openCategoryWindow(name, args, callback) {
        var win = Alloy.createController("exhibition/categories/" + name, args);
        var detailWindow = win.getView();
        if ("iphone" == os) {
            $.confirmationRootWindow.openWindow(detailWindow);
            win.on("select", function() {
                $.confirmationRootWindow.closeWindow(detailWindow);
            });
        } else {
            detailWindow.open();
            win.on("select", function() {
                detailWindow.close();
            });
        }
        win.on("select", callback);
    }
    function updateMainCategory(main) {
        mainCategory = main;
        var item = $.categoriesSection.getItemAt(0);
        "iphone" == os ? item.properties.subtitle = main.title : item.properties.title = main.title;
        $.categoriesSection.updateItemAt(0, item);
    }
    function updateSubCategory(sub) {
        subCategory = sub;
        var item = $.categoriesSection.getItemAt(1);
        "iphone" == os ? item.properties.subtitle = sub.title : item.properties.title = sub.title;
        $.categoriesSection.updateItemAt(1, item);
    }
    function cancel() {
        "iphone" == os ? $.confirmationRootWindow.close() : $.confirmationWindow.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "exhibition/confirmation";
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
    $.__views.confirmationWindow = Ti.UI.createWindow({
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        viewShadowColor: "black",
        opacity: 1,
        id: "confirmationWindow",
        title: "出品"
    });
    $.__views.confirmationWindow && $.addTopLevelView($.__views.confirmationWindow);
    $.__views.itemImage = Ti.UI.createImageView({
        top: 50,
        id: "itemImage"
    });
    $.__views.confirmationWindow.add($.__views.itemImage);
    $.__views.itemTitle = Ti.UI.createLabel({
        top: 150,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: "black",
        id: "itemTitle"
    });
    $.__views.confirmationWindow.add($.__views.itemTitle);
    $.__views.itemAuthor = Ti.UI.createLabel({
        top: 170,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        id: "itemAuthor"
    });
    $.__views.confirmationWindow.add($.__views.itemAuthor);
    $.__views.itemPrice = Ti.UI.createLabel({
        top: 200,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: "#b42800",
        id: "itemPrice"
    });
    $.__views.confirmationWindow.add($.__views.itemPrice);
    var __alloyId16 = [];
    $.__views.__alloyId17 = {
        properties: {
            title: "大学を選択",
            itemId: "mainCategory",
            color: "black",
            id: "__alloyId17"
        }
    };
    __alloyId16.push($.__views.__alloyId17);
    $.__views.__alloyId18 = {
        properties: {
            title: "学部を選択",
            itemId: "subCategory",
            color: "black",
            id: "__alloyId18"
        }
    };
    __alloyId16.push($.__views.__alloyId18);
    $.__views.categoriesSection = Ti.UI.createListSection({
        id: "categoriesSection"
    });
    $.__views.categoriesSection.items = __alloyId16;
    var __alloyId19 = [];
    __alloyId19.push($.__views.categoriesSection);
    $.__views.categoriesView = Ti.UI.createListView({
        height: 100,
        top: 250,
        sections: __alloyId19,
        id: "categoriesView",
        canScroll: "false"
    });
    $.__views.confirmationWindow.add($.__views.categoriesView);
    $.__views.exhibit = Ti.UI.createButton({
        borderRadius: 10,
        backgroundColor: "#fffacd",
        color: "#6495ed",
        left: 40,
        bottom: 50,
        width: 100,
        id: "exhibit",
        title: "出品"
    });
    $.__views.confirmationWindow.add($.__views.exhibit);
    exhibit ? $.addListener($.__views.exhibit, "click", exhibit) : __defers["$.__views.exhibit!click!exhibit"] = true;
    $.__views.cancel = Ti.UI.createButton({
        borderRadius: 10,
        backgroundColor: "#d3d3d3",
        color: "#6495ed",
        right: 40,
        bottom: 50,
        width: 100,
        id: "cancel",
        title: "キャンセル"
    });
    $.__views.confirmationWindow.add($.__views.cancel);
    cancel ? $.addListener($.__views.cancel, "click", cancel) : __defers["$.__views.cancel!click!cancel"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var title = args.title;
    var image = args.image;
    var author = args.author;
    var isbn = args.isbn;
    var price = args.price;
    var mainCategory = {};
    var subCategory = {};
    var os = Ti.Platform.getOsname();
    $.itemImage.setImage(image);
    $.itemTitle.setText(title);
    $.itemAuthor.setText(author);
    $.itemPrice.setText("" == price ? price : price + "円");
    $.categoriesView.addEventListener("itemclick", function(e) {
        if (0 == e.itemIndex) openCategoryWindow("mainCategories", {
            selectedCategory: mainCategory
        }, function(e) {
            updateMainCategory(e.mainCategory);
            updateSubCategory(e.subCategory);
        }); else if (1 == e.itemIndex) {
            if (mainCategory.categoryId < 0 || null == mainCategory.categoryId) {
                Ti.UI.createAlertDialog({
                    title: "大学を選択してください"
                }).show();
                return;
            }
            openCategoryWindow("subCategories", {
                mainCategory: mainCategory,
                selectedCategory: subCategory
            }, function(e) {
                updateSubCategory(e.subCategory);
            });
        }
    });
    __defers["$.__views.exhibit!click!exhibit"] && $.addListener($.__views.exhibit, "click", exhibit);
    __defers["$.__views.cancel!click!cancel"] && $.addListener($.__views.cancel, "click", cancel);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;