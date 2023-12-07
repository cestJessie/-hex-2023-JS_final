import"./bootstrap.min-b978f3b2.js";document.addEventListener("DOMContentLoaded",function(){const t=document.querySelector(".recommendation-wall");t.style.cursor="grab";let e={top:0,left:0,x:0,y:0};const c=function(n){t.style.cursor="grabbing",t.style.userSelect="none",e={left:t.scrollLeft,top:t.scrollTop,x:n.clientX,y:n.clientY},document.addEventListener("mousemove",r),document.addEventListener("mouseup",o)},r=function(n){const p=n.clientX-e.x,d=n.clientY-e.y;t.scrollTop=e.top-d,t.scrollLeft=e.left-p},o=function(){t.style.cursor="grab",t.style.removeProperty("user-select"),document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",o)};t.addEventListener("mousedown",c)});let L=document.querySelector(".menuToggle"),$=document.querySelectorAll(".topBar-menu a"),u=document.querySelector(".topBar-menu");L.addEventListener("click",q);$.forEach(t=>{t.addEventListener("click",E)});function q(){u.classList.contains("openMenu")?u.classList.remove("openMenu"):u.classList.add("openMenu")}function E(){u.classList.remove("openMenu")}function a(t){let e=t.toString().split(".");return e[0]=e[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),e.join(".")}const S="cestjc",s=`https://livejs-api.hexschool.io/api/livejs/v1/customer/${S}`;let i=[],m=[];function T(){b(),l()}T();const f=document.querySelector(".productWrap");function b(){let t=`${s}/products`;axios.get(t).then(e=>{i=e.data.products,console.log(i),v()}).catch(e=>{console.log(e)})}function g(t){return`<li class="productCard">
  <h4 class="productType">新品</h4>
  <img src="${t.images}" alt="">
  <a href="#" class="js-addCart" data-id="${t.id}">加入購物車</a>
  <h3>${t.title}</h3>
  <del class="originPrice">NT$${a(t.origin_price)}</del>
  <p class="nowPrice">NT$${a(t.price)}</p>
</li>`}function v(){let t="";i.forEach(e=>{t+=g(e)}),f.innerHTML=t}const x=document.querySelector(".productSelect");x.addEventListener("change",t=>{const e=t.target.value;if(e==="全部"){v();return}let c="";i.forEach(r=>{r.category===e&&(c+=g(r))}),f.innerHTML=c});f.addEventListener("click",t=>{if(t.preventDefault(),!t.target.classList.contains("js-addCart"))return;let e=t.target.getAttribute("data-id"),c=1;m.forEach(n=>{n.product.id===e&&(c=n.quantity+=1)});let r={data:{productId:e,quantity:c}},o=`${s}/carts`;axios.post(o,r).then(n=>{l()}).catch(n=>{console.log(n)})});const y=document.querySelector(".shoppingCart-tableList");function l(){let t=`${s}/carts`;axios.get(t).then(e=>{const c=e.data.finalTotal;document.querySelector(".js-total").textContent=a(c),m=e.data.carts;let r="";m.forEach(o=>{r+=`<tr>
      <td>
        <div class="cardItem-title">
          <img src="${o.product.images}" alt="">
          <p>${o.product.title}</p>
        </div>
      </td>
      <td>NT$${a(o.product.price)}</td>
      <td>${o.quantity}</td>
      <td>NT$${a(o.product.price*o.quantity)}</td>
      <td class="discardBtn">
        <a href="#" class="material-icons" data-id="${o.id}" data-product="${o.product.title}">
          clear
        </a>
      </td>
    </tr>`}),y.innerHTML=r}).catch(e=>{console.log(e)})}y.addEventListener("click",t=>{t.preventDefault();const e=t.target.getAttribute("data-id");if(e===null)return;let c=`${s}/carts/${e}`;axios.delete(c).then(r=>{l(),setTimeout(function(){const o=t.target.getAttribute("data-product");alert(`成功刪除 ${o} 商品`)},1e3)}).catch(r=>{console.log(r)})});const M=document.querySelector(".discardAllBtn");M.addEventListener("click",t=>{t.preventDefault(),A()});function A(){let t=`${s}/carts`;axios.delete(t).then(e=>{alert("全部刪除成功"),l()}).catch(e=>{alert("購物車已經清空，請勿重複點擊"),console.log(e)})}const B=document.querySelector(".orderInfo-btn");B.addEventListener("submit",t=>{t.preventDefault();const e=document.querySelector("#customerName"),c=document.querySelector("#customerPhone"),r=document.querySelector("#customerEmail"),o=document.querySelector("#customerAddress"),n=document.querySelector("#tradeWay");let p=`${s}/orders`;axios.post(p,{data:{user:{name:e.value,tel:c.value,email:r.value,address:o.value,payment:n.value}}}).then(d=>{alert("訂單建立成功"),h.reset(),l()}).catch(d=>{console.log(d)})});const h=document.querySelector(".orderInfo-form");h.reset();
