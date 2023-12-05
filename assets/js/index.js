const productList = document.querySelector('.productWrap');

let productData = [];

function init(){
  getProductList();
}
init();

function getProductList(){
	axios.get(`url/products`)
	.then((res) => {
		console.log(res);
		productData = response.data.products;
		// console.log(productData);
		renderProductList();	 
	})
}

function renderProductList(){
	let str = "";
	productData.forEach((item) => {
		str += `
		<li class="productCard">
		<h4 class="productType">新品</h4>
		<img src="${item.images}" alt="">
		<a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
		<h3>${item.title}</h3>
		<del class="originPrice">NT$${toThousands(item.origin_price)}</del>
		<p class="nowPrice">NT$${toThousands(item.price)}</p>
		</li>
		`
	})
	getProductList.innerHTML = str;
}


// 千分位
function toThousands(x){
	let parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}