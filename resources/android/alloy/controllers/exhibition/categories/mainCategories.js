function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function checkItem(item, index) {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
        section.updateItemAt(index, item);
    }
    function uncheckItem(item, index) {
        item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
        section.updateItemAt(index, item);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "exhibition/categories/mainCategories";
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
    $.__views.mainCategories = Ti.UI.createWindow({
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        viewShadowColor: "black",
        opacity: 1,
        title: "大学",
        id: "mainCategories"
    });
    $.__views.mainCategories && $.addTopLevelView($.__views.mainCategories);
    $.__views.mainCategoriesSection = Ti.UI.createListSection({
        id: "mainCategoriesSection"
    });
    var __alloyId29 = [];
    __alloyId29.push($.__views.mainCategoriesSection);
    $.__views.mainCategoties = Ti.UI.createListView({
        sections: __alloyId29,
        id: "mainCategoties",
        canScroll: "true",
        defaultItemTemplate: Titanium.UI.LIST_ITEM_TEMPLATE_SETTING,
        color: "black"
    });
    $.__views.mainCategories.add($.__views.mainCategoties);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var section = $.mainCategoriesSection;
    var selected = args.selectedCategory || {};
    var url = Alloy.Globals.config.baseurl + "/wp-admin/admin-ajax.php";
    var getCategoryClient = Ti.Network.createHTTPClient({
        onload: function() {
            var categories = Array.prototype.slice.apply(JSON.parse(this.responseText));
            var items = [];
            for (var i = 0; i < categories.length; i++) items.push({
                properties: {
                    title: categories[i].name,
                    accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE,
                    categoryId: categories[i].term_id,
                    color: "black"
                }
            });
            section.appendItems(items);
            if (selected.index >= 0) {
                var selectedOne = section.getItemAt(selected.index);
                checkItem(selectedOne, selected.index);
            }
        },
        onerror: function(e) {
            Ti.API.debug(e.error);
            var errorDialog = Alloy.Globals.getConnectionErrorDialog();
            errorDialog.show();
        },
        timeout: 5e3
    });
    getCategoryClient = Alloy.Globals.addCookieValueToHTTPClient(getCategoryClient);
    getCategoryClient.open("POST", url);
    getCategoryClient.send({
        action: "get_categories",
        parent: 0
    });
    $.mainCategories.addEventListener("itemclick", function(e) {
        var items = section.getItems();
        var item = section.getItemAt(e.itemIndex);
        if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_NONE) {
            for (var i = 0; i < items.length; i++) i != e.itemIndex && uncheckItem(section.getItemAt(i), i);
            checkItem(item, e.itemIndex);
            $.trigger("select", {
                mainCategory: {
                    title: item.properties.title,
                    index: e.itemIndex,
                    categoryId: item.properties.categoryId
                },
                subCategory: {
                    title: "選択してください",
                    index: -1
                }
            });
        } else {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
            $.trigger("select", {
                mainCategory: {
                    title: "選択してください",
                    index: -1
                },
                subCategory: {
                    title: "選択してください",
                    index: -1
                }
            });
            section.updateItemAt(e.itemIndex, item);
        }
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;