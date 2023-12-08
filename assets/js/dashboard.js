import axios from "axios";
import { api_path, token } from "./config";


const dashboardBaseUrl = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}`;


let orderData = [];


// 初始化
function init() {
  getOrderList();
}
init();


// C3.js
function renderC3() {
  //物件資料搜集
  let total = {};
  orderData.forEach((item) => {
    item.products.forEach((productItem) => {
      if (total[productItem.category] === undefined) {
        total[productItem.category] = productItem.price * productItem.quantity;
      } else {
        total[productItem.category] += productItem.price * productItem.quantity;
      }
    })
  })

  console.log(total);
  //做出資料關聯並整理成C3要求格式
  let categoryAry = Object.keys(total);
  let newData = [];
  categoryAry.forEach((item) => {
    let ary = [];
    ary.push(item);
    ary.push(total[item]);
    newData.push(ary);
  })

  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: "pie",
      columns: newData,
      colors: {
        "床架": "#DACBFF",
        "收納": "#9D7FEA",
        "窗簾": "#5434A7",
        "其他": "#301E5F",
      }
    },
  });
}

// C3_lv2.js
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
  })
  // 資料關聯
  let originAry = Object.keys(obj);

  let rankSortAry = [];
  // 將訂單名稱和其金額push到rankSortAry
  originAry.forEach((item) => {
    let ary = [];
    ary.push(item);
    ary.push(obj[item]);
    rankSortAry.push(ary);
  });
  // 進行排序
  rankSortAry.sort((a, b) => {
    return b[1] - a[1];
  });

  // 筆數超過4筆以上，統整為其他
  if (rankSortAry.length > 3) {
    let otherTotal = 0;
    rankSortAry.forEach((item, index) => {
      if (index > 2) { //從第三筆資料之後做加總
        otherTotal += rankSortAry[index][1]
      }
    })
    // 刪除第三筆之後的資料
    rankSortAry.splice(3, rankSortAry.length - 1);
    // 寫入其他的資料
    rankSortAry.push(['其他', otherTotal]);
  }
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
};


// 取得訂單列表
const orderList = document.querySelector('.js-orderList');
function getOrderList() {
  let url = `${dashboardBaseUrl}/orders`;
  axios.get(url, {
    headers: {
      'Authorization': token,
    }
  })
    .then((response) => {
      orderData = response.data.orders;

      let str = '';
      orderData.forEach((item) => {
        //組時間字串
        const timeStamp = new Date(item.createdAt * 1000);
        const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth() + 1}/${timeStamp.getDate()}`;

        // 組產品字串
        let productStr = "";
        item.products.forEach((productItem) => {
          productStr += `<p>${productItem.title}x${productItem.quantity}</p>`
        })

        //判斷訂單處理狀態
        let orderStatus = '';
        orderStatus = item.paid ? "已處理" : "未處理";

        //組訂單字串
        str += `<tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          <p>${productStr}</p>
        </td>
        <td>${orderTime}</td>
        <td class="orderStatus">
          <a href="#" data-id="${item.id}" class="js-orderStatus" data-status="${item.paid}">${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-delSingleOrderBtn" value="刪除" data-id="${item.id}">
        </td>
      </tr>`;
      })
      orderList.innerHTML = str;
      renderC3_lv2();
    })
    .catch((error) => {
      console.log(error);
    })
};


orderList.addEventListener('click', (e) => {
  e.preventDefault();
  const targetClass = e.target.getAttribute('class');
  let orderId = e.target.getAttribute("data-id");
  // 刪除單筆訂單按鈕判斷
  if (targetClass === 'delSingleOrder-Btn js-delSingleOrderBtn') {
    delSingleOrder(orderId);
  };
  // 訂單狀態判斷
  if (targetClass === 'js-orderStatus') {
    ediotOrderStatus(status, orderId);
    return;
  }
})


// 修改訂單狀態
function ediotOrderStatus(status, orderId) {
  let newStatus;
  newStatus = status === true ? false : true;
  axios.put(`${dashboardBaseUrl}/orders`, {
    "data": {
      "id": orderId,
      "paid": newStatus
    }
  },
    {
      headers: {
        'Authorization': token
      }
    })
    .then((response) => {
      alert("修改訂單狀態成功");
      getOrderList();
    })
    .catch((error) => {
      console.log(error);
    })
}


//刪除購物車指定訂單
function delSingleOrder(orderId) {
  axios.delete(`${dashboardBaseUrl}/orders/${orderId}`, {
    headers: {
      'Authorization': token
    }
  })
    .then((response) => {
      alert("成功刪除該筆訂單");
      getOrderList();
    })
    .catch((error) => {
      console.log(error);
    })
}


//刪除購物車全部訂單
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  axios.delete(`${dashboardBaseUrl}/orders`, {
    headers: {
      'Authorization': token
    }
  })
    .then((response) => {
      alert("成功刪除全部訂單");
      getOrderList();
    })
    .catch((error) => {
      console.log(error);
    })
})