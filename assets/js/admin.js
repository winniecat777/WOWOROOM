let orderData = [];
const orderList = document.querySelector(".js-orderList");

function init(){
  getOrderList();
}
init();

function renderC3_lv2() {
    //資料蒐集
    let obj = {};
    orderData.forEach((item) => {
      item.products.forEach((productItem) => {
        if (obj[productItem.title] === undefined) {
          obj[productItem.title] = productItem.quantity * productItem.price;
        } else {
          obj[productItem.title] += productItem.quantity * productItem.price;
  
        }
      })
    });
    // console.log(obj);
    
    // 拉出資料關聯
    let originAry = Object.keys(obj);
    // console.log(originAry);
    // 透過 originAry，整理成 C3 格式
    let rankSortAry = [];
    
    originAry.forEach((item) =>  {
      let ary = [];
      ary.push(item);
      ary.push(obj[item]);
      rankSortAry.push(ary);
    });
    // console.log(rankSortAry);

    rankSortAry.sort((a, b) => {
      return b[1] - a[1];
    })
    
    // 如果筆數超過 4 筆以上，就統整為其它
    if (rankSortAry.length > 3) {
      let otherTotal = 0;
      rankSortAry.forEach((item, index) => {
        if (index > 2) {
          otherTotal += rankSortAry[index][1];
        }
      })
      rankSortAry.splice(3, rankSortAry.length - 1);
      rankSortAry.push(['其他', otherTotal]);
    }
    // 超過三筆後將第四名之後的價格加總起來放在 otherTotal
    c3.generate({
      bindto: '#chart',
      data: {
        columns: rankSortAry,
        type: 'pie',
      },
      color: {
        pattern: ["#301E5F", "#5434A7", "#9D7FEA", "#DACBFF"]
      }
    });
  }

  // 取得訂單資料
function getOrderList(){
    axios.get(`${url_admin}/orders`,{
      headers:{
        'Authorization':token,
      }
    })
    .then((res) => {
      orderData = res.data.orders;
    //   console.log(orderData);
      // 訂單字串
      let str = '';
      orderData.forEach((item) => {
        // 組時間字串
        const timeStamp = new Date(item.createdAt*1000); // 需 *1000 轉成毫秒
        const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth()+1}/${timeStamp.getDate()}`;
        
        // 組產品字串
        let productStr = "";
        item.products.forEach((productItem) => {
          productStr += `<p>${productItem.title}x${productItem.quantity}</p>`
        })
      // 判斷訂單處理狀態
      let orderStatus="";
      if(item.paid==true){
        orderStatus="已處理"
      }else{
        orderStatus = "未處理"
      }
      // 組訂單字串
        str +=`<tr>
            <td>${item.id}</td>
            <td>
              <p>${item.user.name}</p>
              <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
              ${productStr}
            </td>
            <td>${orderTime}</td>
            <td class=" js-orderStatus">
              <a href="#" data-status="${item.paid}" class="orderStatus" data-id="${item.id}">${orderStatus}</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
            </td>
          </tr>`
      })
      orderList.innerHTML = str;
      renderC3_lv2();
    })
  }
  
  orderList.addEventListener("click",(e) => {
    e.preventDefault();
    const targetClass = e.target.getAttribute("class");
    let id = e.target.getAttribute("data-id");
    if (targetClass == "delSingleOrder-Btn js-orderDelete" ){
      deleteOrderItem(id);
      return;
    }
    if (targetClass == "orderStatus"){
      let status = e.target.getAttribute("data-status");
      changeOrderStatus(status,id);
      return;
    }
  })
  
  // 訂單狀態
  function changeOrderStatus(status,id){
    console.log(status,id);
    let newStatus;
    if(status==true){
      newStatus=false;
    }else{
      newStatus=true;
    }
    axios.put(`${url_admin}/orders`,{
      "data": {
        "id": id,
        "paid": newStatus
      }
    } ,{
      headers: {
        'Authorization': token,
      }
    })
    .then((res) => {
      alert("修改訂單成功");
      getOrderList();
    })
  } 
  // 刪除一筆訂單
  function deleteOrderItem(id){
    axios.delete(`${url_admin}/orders/${id}`, {
      headers: {
        'Authorization': token,
      }
    })
      .then((res) => {
        Swal.fire({
			title: "已刪除該筆訂單",
			icon: "success",
		});
        getOrderList();
      }) 
  } 
  // 刪除全部訂單
  const discardAllBtn = document.querySelector(".discardAllBtn");
  discardAllBtn.addEventListener("click",(e) => {
    e.preventDefault();
    axios.delete(`${url_admin}/orders`, {
      headers: {
        'Authorization': token,
      }
    })
      .then((res) => {
        Swal.fire({
			title: "已刪除全部訂單",
			icon: "success",
		});
        getOrderList();
      })
  })