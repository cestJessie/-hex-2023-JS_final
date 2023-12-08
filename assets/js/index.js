import axios from "axios";
import { toThousands } from "./utils";
import { api_path } from "./config";
import validate from "validate.js";



const baseUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}`;


let productData = [];
let cartData = [];


// 初始化
function init() {
  getProductList();
  getCartList();
}
init();


// 取得產品列表
const productList = document.querySelector(".productWrap");
function getProductList() {
  let url = `${baseUrl}/products`;
  axios
    .get(url)
    .then((response) => {
      // 全域變數 productData
      productData = response.data.products;
      console.log(productData);
      renderProductList();
    })
    .catch((error) => {
      console.log(error);
    });
}


// 組合productList render字串
function buildProductListHTML(item) {
  return `<li class="productCard">
  <h4 class="productType">新品</h4>
  <img src="${item.images}" alt="">
  <a href="#" class="js-addCart" data-id="${item.id}">加入購物車</a>
  <h3>${item.title}</h3>
  <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
  <p class="nowPrice">NT$${toThousands(item.price)}</p>
</li>`;
}


// 渲染產品列表
function renderProductList() {
  let str = '';
  productData.forEach((item) => {
    str += buildProductListHTML(item);
  })
  productList.innerHTML = str;
}


// 下拉選單
const productSelect = document.querySelector(".productSelect");
productSelect.addEventListener('change', (e) => {
  const category = e.target.value;
  if (category === '全部') {
    renderProductList();
    return;
  }
  let str = '';
  productData.forEach((item) => {
    if (item.category === category) {
      str += buildProductListHTML(item);
    }
  })
  productList.innerHTML = str;
})


// 加入購物車(若監聽綁在按鈕上效能會較差)
productList.addEventListener('click', (e) => {
  e.preventDefault(); // 禁止預設轉址
  if (!e.target.classList.contains('js-addCart')) {
    return;
  }
  let productId = e.target.getAttribute('data-id');
  let numCheck = 1;
  cartData.forEach((item) => {
    if (item.product.id === productId) {
      numCheck = item.quantity += 1;
    }
  })
  let addData = {
    data: {
      productId: productId,
      quantity: numCheck
    }
  }
  let url = `${baseUrl}/carts`;
  axios.post(url, addData)
    .then((response) => {
      alert('成功加入購物車')
      getCartList();
    })
    .catch((error) => {
      console.log(error);
    })
})


// 取得購物車列表
const cartList = document.querySelector('.shoppingCart-tableList');
function getCartList() {
  let url = `${baseUrl}/carts`;
  axios.get(url)
    .then((response) => {
      const total = response.data.finalTotal;
      document.querySelector(".js-total").textContent = toThousands(total); //計算總金額
      cartData = response.data.carts;
      let str = '';
      cartData.forEach((item) => {
        str += `<tr>
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
        <a href="#" class="material-icons" data-id="${item.id}" data-product="${item.product.title}">
          clear
        </a>
      </td>
    </tr>`
      })
      cartList.innerHTML = str;
    })
    .catch((error) => {
      console.log(error);
    })
}


// 刪除購物車內特定產品
cartList.addEventListener('click', (e) => {
  e.preventDefault();
  const cartId = e.target.getAttribute('data-id');
  if (cartId === null) {
    return;
  }
  let url = `${baseUrl}/carts/${cartId}`;
  axios
    .delete(url)
    .then((response) => {
      getCartList();
      setTimeout(function () {
        const productTitle = e.target.getAttribute('data-product');
        alert(`成功刪除 ${productTitle} 商品`);
      }, 1000);
    })
    .catch((error) => {
      console.log(error);
    });
})


// 清除購物車內全部產品
const discardAllBtn = document.querySelector('.discardAllBtn');
discardAllBtn.addEventListener('click', (e) => {
  e.preventDefault();
  deleteAllCartItem();
});


// 刪除購物車內全部產品
function deleteAllCartItem() {
  let url = `${baseUrl}/carts`;
  axios
    .delete(url)
    .then((response) => {
      alert('全部刪除成功');
      getCartList();
    })
    .catch((error) => {
      alert("購物車已經清空，請勿重複點擊");
      console.log(error);
    });
}


// 送出訂單
// 用戶須滿足兩條件：
// 1. 詳填訂單資訊
// 2. 購物車有品項
const orderInfoBtn = document.querySelector(".orderInfo-btn");

orderInfoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (orderFormValidation()) {
    return;
  };
  const customerName = document.querySelector("#customerName");
  const customerPhone = document.querySelector("#customerPhone");
  const customerEmail = document.querySelector("#customerEmail");
  const customerAddress = document.querySelector("#customerAddress");
  const tradeWay = document.querySelector("#tradeWay");

  axios
    .post(`${baseUrl}/orders`, {
      "data": {
        "user": {
          "name": customerName.value,
          "tel": customerPhone.value,
          "email": customerEmail.value,
          "address": customerAddress.value,
          "payment": tradeWay.value,
        }
      }
    })
    .then((response) => {
      alert("訂單建立成功");
      //clearInputs(inputs);
      orderForm.reset();
      getCartList();
    })
    .catch((error) => {
      console.log(error);
    });
});


// 表單清空
const orderForm = document.querySelector(".orderInfo-form");
orderForm.reset();


//驗證功能
const orderInfoForm = document.querySelector('#orderInfo');
const inputsOrder = document.querySelectorAll("input[type=text],input[type=tel],input[type=email]");
const constraints = {
  姓名: {
    presence: {
      allowEmpty: false,
      message: "為必填欄位"
    }
  },
  電話: {
    presence: {
      allowEmpty: false,
      message: "為必填欄位"
    },
    format: {
      pattern: /^[0-9\-\+\s]+$/,
      message: "必須為有效的電話號碼格式"
    }
  },
  Email: {
    presence: {
      allowEmpty: false,
      message: "為必填欄位"
    },
    email: {
      message: "必須為有效的電子郵件格式"
    }
  },
  寄送地址: {
    presence: {
      allowEmpty: false,
      message: "為必填欄位"
    },
    format: {
      pattern: /[^]{3,}/,
      message: "必須為有效的地址格式"
    }
  },
};

function orderFormValidation() {
  inputsOrder.forEach((item) => {
    // 預設為空值不顯示
    item.nextElementSibling.textContent = "";
    // 驗證回傳的內容
    let errors = validate(orderInfoForm, constraints);
    console.log(orderInfoForm);
    // 渲染畫面
    if (errors) {
      Object.keys(errors).forEach((keys) => {
        document.querySelector(`[data-message="${keys}"]`).textContent = errors[keys];
      });
    }
  });
};
