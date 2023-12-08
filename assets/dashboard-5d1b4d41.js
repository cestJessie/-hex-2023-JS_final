import{a as l,t as d,b as $}from"./config-35a3cd95.js";let S=document.querySelector(".menuToggle"),A=document.querySelectorAll(".topBar-menu a"),o=document.querySelector(".topBar-menu");S.addEventListener("click",y);A.forEach(t=>{t.addEventListener("click",v)});function y(){o.classList.contains("openMenu")?o.classList.remove("openMenu"):o.classList.add("openMenu")}function v(){o.classList.remove("openMenu")}const i=`https://livejs-api.hexschool.io/api/livejs/v1/admin/${$}`;let u=[];function E(){c()}E();function B(){let t={};u.forEach(e=>{e.products.forEach(a=>{t[a.title]===void 0?t[a.title]=a.quantity*a.price:t[a.title]+=a.quantity*a.price})});let n=Object.keys(t),r=[];if(n.forEach(e=>{let a=[];a.push(e),a.push(t[e]),r.push(a)}),r.sort((e,a)=>a[1]-e[1]),r.length>3){let e=0;r.forEach((a,s)=>{s>2&&(e+=r[s][1])}),r.splice(3,r.length-1),r.push(["其他",e])}c3.generate({bindto:"#chart",data:{columns:r,type:"pie"},color:{pattern:["#301E5F","#5434A7","#9D7FEA","#DACBFF"]}})}const f=document.querySelector(".js-orderList");function c(){let t=`${i}/orders`;l.get(t,{headers:{Authorization:d}}).then(n=>{u=n.data.orders;let r="";u.forEach(e=>{const a=new Date(e.createdAt*1e3),s=`${a.getFullYear()}/${a.getMonth()+1}/${a.getDate()}`;let p="";e.products.forEach(g=>{p+=`<p>${g.title}x${g.quantity}</p>`});let h="";h=e.paid?"已處理":"未處理",r+=`<tr>
        <td>${e.id}</td>
        <td>
          <p>${e.user.name}</p>
          <p>${e.user.tel}</p>
        </td>
        <td>${e.user.address}</td>
        <td>${e.user.email}</td>
        <td>
          <p>${p}</p>
        </td>
        <td>${s}</td>
        <td class="orderStatus">
          <a href="#" data-id="${e.id}" class="js-orderStatus" data-status="${e.paid}">${h}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-delSingleOrderBtn" value="刪除" data-id="${e.id}">
        </td>
      </tr>`}),f.innerHTML=r,B()}).catch(n=>{console.log(n)})}f.addEventListener("click",t=>{t.preventDefault();const n=t.target.getAttribute("class");let r=t.target.getAttribute("data-id");if(n==="delSingleOrder-Btn js-delSingleOrderBtn"&&j(r),n==="js-orderStatus"){L(status,r);return}});function L(t,n){let r;r=t!==!0,l.put(`${i}/orders`,{data:{id:n,paid:r}},{headers:{Authorization:d}}).then(e=>{alert("修改訂單狀態成功"),c()}).catch(e=>{console.log(e)})}function j(t){l.delete(`${i}/orders/${t}`,{headers:{Authorization:d}}).then(n=>{alert("成功刪除該筆訂單"),c()}).catch(n=>{console.log(n)})}const O=document.querySelector(".discardAllBtn");O.addEventListener("click",t=>{t.preventDefault(),l.delete(`${i}/orders`,{headers:{Authorization:d}}).then(n=>{alert("成功刪除全部訂單"),c()}).catch(n=>{console.log(n)})});
