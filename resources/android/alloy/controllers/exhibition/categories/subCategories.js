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
    this.__controllerPath = "exhibition/categories/subCategories";
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
    $.__views.subCategories = Ti.UI.createWindow({
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        viewShadowColor: "black",
        opacity: 1,
        title: "学部",
        id: "subCategories"
    });
    $.__views.subCategories && $.addTopLevelView($.__views.subCategories);
    $.__views.subCategoriesSection = Ti.UI.createListSection({
        id: "subCategoriesSection"
    });
    var __alloyId31 = [];
    __alloyId31.push($.__views.subCategoriesSection);
    $.__views.subCategoties = Ti.UI.createListView({
        sections: __alloyId31,
        id: "subCategoties",
        canScroll: "true",
        defaultItemTemplate: Titanium.UI.LIST_ITEM_TEMPLATE_SETTING
    });
    $.__views.subCategories.add($.__views.subCategoties);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var section = $.subCategoriesSection;
    var mainCategory = args.mainCategory || {};
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
        parent: mainCategory.categoryId
    });
    $.subCategories.addEventListener("itemclick", function(e) {
        var items = section.getItems();
        var item = section.getItemAt(e.itemIndex);
        if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_NONE) {
            for (var i = 0; i < items.length; i++) i != e.itemIndex && uncheckItem(section.getItemAt(i), i);
            checkItem(item, e.itemIndex);
            $.trigger("select", {
                subCategory: {
                    title: item.properties.title,
                    index: e.itemIndex,
                    categoryId: item.properties.categoryId
                }
            });
        } else {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
            $.trigger("select", {
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