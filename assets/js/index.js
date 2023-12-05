const productList = document.querySelector('.productWrap');


function init(){
  // getProductList();
}
init();

function getProductList(){
	axios.get(`url/products`)
	.then((res) => {
		console.log(res);
		productData = response.data.products;
		// console.log(productData);	 
	})
}