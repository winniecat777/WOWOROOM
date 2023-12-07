import"./bootstrap.min-95458c69.js";let l=[];const u=document.querySelector(".js-orderList");function c(){n()}c();function h(){let e={};l.forEach(r=>{r.products.forEach(a=>{e[a.title]===void 0?e[a.title]=a.quantity*a.price:e[a.title]+=a.quantity*a.price})});let s=Object.keys(e),t=[];if(s.forEach(r=>{let a=[];a.push(r),a.push(e[r]),t.push(a)}),t.sort((r,a)=>a[1]-r[1]),t.length>3){let r=0;t.forEach((a,d)=>{d>2&&(r+=t[d][1])}),t.splice(3,t.length-1),t.push(["其他",r])}c3.generate({bindto:"#chart",data:{columns:t,type:"pie"},color:{pattern:["#301E5F","#5434A7","#9D7FEA","#DACBFF"]}})}function n(){axios.get(`${url_admin}/orders`,{headers:{Authorization:token}}).then(e=>{l=e.data.orders;let s="";l.forEach(t=>{const r=new Date(t.createdAt*1e3),a=`${r.getFullYear()}/${r.getMonth()+1}/${r.getDate()}`;let d="";t.products.forEach(o=>{d+=`<p>${o.title}x${o.quantity}</p>`});let i="";t.paid==!0?i="已處理":i="未處理",s+=`<tr>
            <td>${t.id}</td>
            <td>
              <p>${t.user.name}</p>
              <p>${t.user.tel}</p>
            </td>
            <td>${t.user.address}</td>
            <td>${t.user.email}</td>
            <td>
              ${d}
            </td>
            <td>${a}</td>
            <td class=" js-orderStatus">
              <a href="#" data-status="${t.paid}" class="orderStatus" data-id="${t.id}">${i}</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${t.id}" value="刪除">
            </td>
          </tr>`}),u.innerHTML=s,h()})}u.addEventListener("click",e=>{e.preventDefault();const s=e.target.getAttribute("class");let t=e.target.getAttribute("data-id");if(s=="delSingleOrder-Btn js-orderDelete"){p(t);return}if(s=="orderStatus"){let r=e.target.getAttribute("data-status");f(r,t);return}});function f(e,s){console.log(e,s);let t;e==!0?t=!1:t=!0,axios.put(`${url_admin}/orders`,{data:{id:s,paid:t}},{headers:{Authorization:token}}).then(r=>{alert("修改訂單成功"),n()})}function p(e){axios.delete(`${url_admin}/orders/${e}`,{headers:{Authorization:token}}).then(s=>{Swal.fire({title:"已刪除該筆訂單",icon:"success"}),n()})}const $=document.querySelector(".discardAllBtn");$.addEventListener("click",e=>{e.preventDefault(),axios.delete(`${url_admin}/orders`,{headers:{Authorization:token}}).then(s=>{Swal.fire({title:"已刪除全部訂單",icon:"success"}),n()})});
