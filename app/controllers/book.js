// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;
var title = args.title || "政治はなぜ嫌われるのか――民主主義の取り戻し方";
var image_url = args.url;
var author = args.author || "コリン・ヘイ";
var category = args.category || "法学部";
var point = args.point || "2";
var price = args.price || "3,024円";
var count = args.count || "1冊";

$.book_title.text = title;
$.book_author.text = "著者: " + author;
$.book_image.image = "http://texchg.com/wp-content/uploads/2015/11/41idxgZ409L._SL160_-112x150.jpg"; // set args value
$.book_category.text = "カテゴリー: " + category;
$.book_point.text = "ポイント数: " + point;
$.book_price.text = "Amazon価格: " + price;
$.book_count.text = "残り冊数: " + count;

