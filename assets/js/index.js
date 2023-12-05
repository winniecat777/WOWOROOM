const productList = document.querySelector('.productWrap');


function init(){
  // getProductList();
}
init();

function getProductList(){
	axios.get(`url/products`)
	.then((res) => {
			console.log(res); 
	})
}