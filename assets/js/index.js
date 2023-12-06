const productList = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');
const cartList = document.querySelector(".shoppingCart-tableList");
// 刪除全部購物車按鈕
const discardAllBtn = document.querySelector(".discardAllBtn");
// 送出訂單按鈕
const orderInfoBtn = document.querySelector(".orderInfo-btn");

let productData = [];
let cartData = [];

function init(){
  getProductList();
	getCartList();
}
init();

function getProductList(){
	axios.get(`${url}/products`)
	.then((res) => {
		productData = res.data.products;
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
		<a href="#" class="js-addCart" id="addCardBtn" data-id="${item.id}">加入購物車</a>
		<h3>${item.title}</h3>
		<del class="originPrice">NT$${toThousands(item.origin_price)}</del>
		<p class="nowPrice">NT$${toThousands(item.price)}</p>
		</li>
		`
	})
	productList.innerHTML = str;
}

// 類別下拉選單
productSelect.addEventListener('change',(e) => {
	const category = e.target.value;
	if(category === "全部"){
		renderProductList();
		return;
	}
	let str = "";
	productData.forEach((item) => {
		if(item.category === category)
		str += `
		<li class="productCard">
		<h4 class="productType">新品</h4>
		<img src="${item.images}" alt="">
		<a href="#" class="js-addCart" id="addCardBtn" data-id="${item.id}">加入購物車</a>
		<h3>${item.title}</h3>
		<del class="originPrice">NT$${toThousands(item.origin_price)}</del>
		<p class="nowPrice">NT$${toThousands(item.price)}</p>
		</li>
		`
	})
	productList.innerHTML = str;
})

function getCartList(){
	axios.get(`${url}/carts`)
		.then((res) => {
			document.querySelector(".js-total").textContent = toThousands(res.data.finalTotal);
			cartData = res.data.carts;
			let str = "";
			cartData.forEach((item) => {
				str +=`
				<tr>
					<td>
							<div class="cardItem-title">
									<img src="${item.product.images}" alt="">
									<p>${item.product.title}</p>
							</div>
					</td>
					<td>NT$${toThousands(item.product.price)}</td>
					<td>${item.quantity}</td>
					<td>NT$${toThousands(item.product.price * item.quantity)}</td>
					<td class="discardBtn">
							<a href="#" class="material-icons" data-id="${item.id}">
									clear
							</a>
					</td>
				</tr>
				`
			});
			cartList.innerHTML = str;
		})
}

// 加入購物車
productList.addEventListener("click",(e) => {
	e.preventDefault();
	let addCartClass = e.target.getAttribute("class");
	if(addCartClass !== "js-addCart"){
		return;
	}
	let productId = e.target.getAttribute("data-id");
	let num = 1;
	cartData.forEach((item) => {
		if(item.product.id === productId){
			num = item.quantity ++;
		}
	})
	axios.post(`${url}/carts`,{
		"data":{
			"productId": productId,
			"quantity": num
		}
	}).then((res) => {
		alert("已加入購物車");
		getCartList();
	})
})

cartList.addEventListener('click',(e) => {
	e.preventDefault();
	const cardId = e.target.getAttribute("data-id");
	if(cardId == null){
		return;
	}
	axios.delete(`${url}/carts/${cardId}`)
	.then((res) => {
		alert("刪除單筆購物車成功");
		getCartList();
	})
})

discardAllBtn.addEventListener("click",(e) => {
	e.preventDefault();
	axios.delete(`${url}/carts`)
	.then((res) => {
		alert("刪除全部購物車成功！");
    getCartList();
	})
	.catch((error) => {
		Swal.fire({
			title: "您的購物車已清空",
			icon: "success",
		});
	})
})

// 送出訂單
orderInfoBtn.addEventListener("click",(e) => {
	e.preventDefault();
	if(cartData.length == 0){
		Swal.fire({
			title: "您的購物車是空的，趕快逛逛本季新品吧",
			icon: "warning",
		});
		return;
	}

	const validatePhone = /^09\d{8}$/;
	const validateEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	const constraints = {
		姓名: {
			presence: {
				message: "必填"
			},
		},
		手機: {
			presence: {
				message: "必填"
			},
			format: {
				pavalidatePhonetern: validatePhone,
				message: "格式不符"
			},
		},
		Email: {
			presence: {
				message: "必填"
			},
			email: {
				validateEmail: validateEmail,
				message: "格式不符"
			},
		},
		寄送地址: {
			presence: {
				message: "必填"
			},
		},
	};
	const inputs = document.querySelectorAll("input[name],select[data=payment]");
	const form = document.querySelector(".orderInfo-form");
	const orderInfoBtn = document.querySelector(".orderInfo-btn");
	inputs.forEach((item) => {
		item.addEventListener("change", function () {
			item.nextElementSibling.textContent = '';
			let errors = validate(form, constraints) || '';
			if (errors) {
				Object.keys(errors).forEach(function (keys) {
					document.querySelector(`[data-message="${keys}"]`).textContent = errors[keys];
				});
				orderInfoBtn.classList.add("disabled");
			}else {
        orderInfoBtn.classList.remove("disabled");
      }
		});
	});
	// if (customerName == "" || customerPhone == "" || customerEmail == "" || customerAddress == "" || customerTradeWay == ""){
	// 	alert("請勿輸入空資訊");
  //   return;
	// }
	const customerName = document.querySelector("#customerName").value;
	const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const customerTradeWay = document.querySelector("#tradeWay").value;
	axios.post(`${url}/orders`,{
    "data": {
      "user": {
        "name": customerName,
        "tel": customerPhone,
        "email": customerEmail,
        "address": customerAddress,
        "payment": customerTradeWay
      }
    }
  }).then((res) => {
    Swal.fire({
      title: "訂購成功!",
      icon: "success",
    });
		getCartList();	
		form.reset();
		// // 訂單建立成功後，需把 input 資料清空，恢復初始值
		// document.querySelector("#customerName").value="";
		// document.querySelector("#customerPhone").value="";
		// document.querySelector("#customerEmail").value="";
		// document.querySelector("#customerAddress").value="";
		// document.querySelector("#tradeWay").value="ATM";
    
  })
})

// const customerEmail = document.querySelector("#customerEmail");
// customerEmail.addEventListener("blur",(e) => {
//   if (validateEmail(customerEmail.value) == false) {
//     document.querySelector(`[data-message=Email]`).textContent = "請填寫正確 Email 格式";
//     return;
//   }
// })


// 千分位
function toThousands(x){
	let parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

// 驗證 Email
// function validateEmail(mail) {
//   if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
//     return true
//   }
//   return false;
// }

// 驗證電話
// function validatePhone(phone) {
//   if (/^[09]{2}\d{8}$/.test(phone)) {
//     return true
//   }
//   return false;
// }