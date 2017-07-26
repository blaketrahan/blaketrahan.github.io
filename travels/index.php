<html>
<head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/7.2.0/lazyload.min.js"></script>
<style>
body {
	background: #f5f5f5;
}
img {
	display: inline-block;
    max-width: 48%;
    vertical-align: middle;
    border: 60px solid #f5f5f5;
    box-sizing: border-box;
    margin: 10px;
    max-height: 100vh;
}
.featured {
	display: block;
    width: auto;
    max-width: 100%;
    margin: auto;
    max-height: 100vh;
	border-width: 35px;
}
</style>
</head>
<body>

<script>
var images = [<?php
$files = glob('*.{jpg,png,gif}', GLOB_BRACE);
$str = "";
foreach($files as $file) {
  $str .="\"" . $file . "\",";
}
echo $str;
?>];
var max_count = 2000;
var start = 0;
// var imglocation = "https://dl.dropboxusercontent.com/u/104753816/media/uploads/";
var imglocation = "";
var featured_images = [
	"IMG_1855.jpg",
	"IMG_1895.jpg",
	"IMG_1897.jpg",
	"IMG_1898.jpg",
	"IMG_2037.jpg",
	"IMG_2086.jpg",
	"IMG_2087.jpg",
	"IMG_2215.jpg",
	"IMG_2204.jpg",
	"IMG_2223.jpg",
	"IMG_2224.jpg",
	"IMG_2225a.jpg",
	"IMG_2282.jpg",
	"IMG_2348.jpg",
	"IMG_2250.jpg",
	"IMG_2351.jpg",
	"IMG_2415.jpg",
	"IMG_2454.jpg",
	"IMG_2514a.jpg",
	"IMG_2515a.jpg",
	"IMG_2530a.jpg",
	"IMG_2607.jpg",
	"IMG_2675.jpg",
	"IMG_2677.jpg",
	"IMG_2684.jpg",
	"IMG_2680.jpg",
	"IMG_2825.jpg",
	"IMG_2849.jpg",
	"IMG_2899.jpg",
	"IMG_2901.jpg",
	"IMG_2947.jpg",
	"IMG_2963.jpg",
	"IMG_2958a.jpg",
	"IMG_2982.jpg",
	"IMG_3017.jpg",
	"IMG_3157.jpg",
];
for (var i = start; i < images.length && i < start + max_count; i++)
{
	var classes = "image";
	var lazyloadable = ((i-start) < 4) ? "src" :"data-original";
	if (featured_images.includes(images[i])) {
		classes += " featured"
		max_count++;
	}
	document.body.innerHTML += "<img class='"+classes+"' "+lazyloadable+"='"+ imglocation + images[i] + "'>";
}
// var myLazyLoad = new LazyLoad();


</script>
</body></html>