import"./bootstrap.min-95458c69.js";const i=document.querySelector(".productWrap"),E=document.querySelector(".productSelect"),g=document.querySelector(".shoppingCart-tableList"),L=document.querySelector(".discardAllBtn"),C=document.querySelector(".orderInfo-btn");let u=[],l=[];function T(){b(),o()}T();function b(){axios.get(`${url}/products`).then(t=>{u=t.data.products,h()})}function h(){let t="";u.forEach(e=>{t+=`
		<li class="productCard">
		<h4 class="productType">新品</h4>
		<img src="${e.images}" alt="">
		<a href="#" class="js-addCart" id="addCardBtn" data-id="${e.id}">加入購物車</a>
		<h3>${e.title}</h3>
		<del class="originPrice">NT$${c(e.origin_price)}</del>
		<p class="nowPrice">NT$${c(e.price)}</p>
		</li>
		`}),i.innerHTML=t}E.addEventListener("change",t=>{const e=t.target.value;if(e==="全部"){h();return}let r="";u.forEach(a=>{a.category===e&&(r+=`
		<li class="productCard">
		<h4 class="productType">新品</h4>
		<img src="${a.images}" alt="">
		<a href="#" class="js-addCart" id="addCardBtn" data-id="${a.id}">加入購物車</a>
		<h3>${a.title}</h3>
		<del class="originPrice">NT$${c(a.origin_price)}</del>
		<p class="nowPrice">NT$${c(a.price)}</p>
		</li>
		`)}),i.innerHTML=r});function o(){axios.get(`${url}/carts`).then(t=>{document.querySelector(".js-total").textContent=c(t.data.finalTotal),l=t.data.carts;let e="";l.forEach(r=>{e+=`
				<tr>
					<td>
							<div class="cardItem-title">
									<img src="${r.product.images}" alt="">
									<p>${r.product.title}</p>
							</div>
					</td>
					<td>NT$${c(r.product.price)}</td>
					<td>${r.quantity}</td>
					<td>NT$${c(r.product.price*r.quantity)}</td>
					<td class="discardBtn">
							<a href="#" class="material-icons" data-id="${r.id}">
									clear
							</a>
					</td>
				</tr>
				`}),g.innerHTML=e})}i.addEventListener("click",t=>{if(t.preventDefault(),t.target.getAttribute("class")!=="js-addCart")return;let r=t.target.getAttribute("data-id"),a=1;l.forEach(s=>{s.product.id===r&&(a=s.quantity++)}),axios.post(`${url}/carts`,{data:{productId:r,quantity:a}}).then(s=>{alert("已加入購物車"),o()})});g.addEventListener("click",t=>{t.preventDefault();const e=t.target.getAttribute("data-id");e!=null&&axios.delete(`${url}/carts/${e}`).then(r=>{Swal.fire({title:"該品項已刪除",icon:"success"}),o()})});L.addEventListener("click",t=>{t.preventDefault(),axios.delete(`${url}/carts`).then(e=>{Swal.fire({title:"已清空購物車",icon:"success"}),o()}).catch(e=>{Swal.fire({title:"您的購物車已清空",icon:"success"})})});C.addEventListener("click",t=>{if(t.preventDefault(),l.length==0){Swal.fire({title:"您的購物車是空的，趕快逛逛本季新品吧",icon:"warning"});return}const a={姓名:{presence:{message:"必填"}},電話:{presence:{message:"必填"},format:{pattern:/^09\d{8}$/,message:"格式不符"}},Email:{presence:{message:"必填"},email:{validateEmail:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,message:"格式不符"}},寄送地址:{presence:{message:"必填"}}},s=document.querySelectorAll("input[name],select[data=payment]"),p=document.querySelector(".orderInfo-form"),m=document.querySelector(".orderInfo-btn");s.forEach(n=>{n.addEventListener("blur",function(){n.nextElementSibling.textContent="";let d=validate(p,a)||"";console.log(d),d?(Object.keys(d).forEach(function(f){document.querySelector(`[data-message="${f}"]`).textContent=d[f]}),m.classList.add("disabled")):m.classList.remove("disabled")})});const $=document.querySelector("#customerName").value,y=document.querySelector("#customerPhone").value,v=document.querySelector("#customerEmail").value,S=document.querySelector("#customerAddress").value,q=document.querySelector("#tradeWay").value;axios.post(`${url}/orders`,{data:{user:{name:$,tel:y,email:v,address:S,payment:q}}}).then(n=>{Swal.fire({title:"訂購成功!",icon:"success"}),o(),p.reset()}).catch(n=>{console.log(n.res.data.message.join(" "))})});function c(t){let e=t.toString().split(".");return e[0]=e[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),e.join(".")}
