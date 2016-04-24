// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var title = args.title;
var image_url = args.url;
var author = args.author || "(データ無し)";
var category = args.category || "（カテゴリ無し）";
var price = !isNaN(args.price) ? args.price : "(データ無し)";
var count = !isNaN(args.count) ? args.count : "(古本市で確認ください)";
var point;

if(isNaN(price)){
	point = "(古本市で確認ください)";
}else{
	point = price / 1000 >= 2 ? 2 : 1; 
}


$.book_title.text = title;
$.book_author.text = "著者: " + author;
$.book_image.image = image_url;
$.book_category.text = "カテゴリー: " + category;
$.book_point.text = "ポイント数: " + point;
$.book_price.text = "Amazon価格: " + Number(price).toLocaleString('ja-JP') + "円";
$.book_count.text = "残り冊数: " + count;

