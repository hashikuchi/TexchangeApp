var searchBox = Ti.UI.createTextField({
	hintText: "キーワードで検索",
	width: "60%",
	color: "black"
});
searchBox.addEventListener("return", function(e){
	var searchWin = Alloy.createController('searchBooks').getView();
	searchWin.open();
});

$.searchMenuWin.add(Alloy.Globals.createCommonHeader([searchBox]));

var header = Ti.UI.createTableViewSection({headerTitle: "カテゴリから検索"});
var sectionNagoya = Ti.UI.createTableViewSection({headerTitle: "名古屋大学"});
sectionNagoya.add(createRow("文学部"));
sectionNagoya.add(createRow("理学部"));
sectionNagoya.add(createRow("医学部"));

var sectionNanzan = Ti.UI.createTableViewSection({headerTitle: "南山大学"});
sectionNanzan.add(createRow("経済学部"));
sectionNanzan.add(createRow("商学部"));
sectionNanzan.add(createRow("工学部"));

var categoriesData = [header, sectionNagoya, sectionNanzan];

var categoriesTable = Ti.UI.createTableView({data:categoriesData});
categoriesTable.top = 70;

$.searchMenuWin.add(categoriesTable);

function createRow(title){
	var row = Ti.UI.createTableViewRow({
		title: title,
		color: "black"
	});
	row.addEventListener("click", function(e){
		var searchWin = Alloy.createController('searchBooks').getView();
		searchWin.open();
	});
	return row;
}
