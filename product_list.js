const app = {
// 資料
data:{
url : "https://vue3-course-api.hexschool.io/",
path :"alicialo"

}

//初始化 取得token資訊儲存到header
,init(){
    // 注意token中的自訂變數要寫對(ex.hexToken)
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token; 
}

//取得產品資料 > 渲染到頁面
,render(){  
const list= document.querySelector(".list");
const productCount= document.querySelector(".productCount");

let txt="";
axios.get(`${this.data.url}api/${this.data.path}/products`)
.then(res=>{
    res.data.products.forEach(function(item){
    txt+= ` <tr>
    <td> ${item.title}</td>
    <td width="120">
     ${item.origin_price}
    </td>
    <td width="120">
    ${item.price}
    </td>
    <td width="100">
      <span class="">${item.is_enabled? "啟用":"不啟用"}</span>
    </td>
    <td width="120">
      <button type="button" class="btn btn-sm btn-outline-danger move deleteBtn" data-action="remove" data-id="${item.id}"> 刪除 </button>
    </td>`;

    list.innerHTML=txt;
    productCount.textContent=res.data.products.length;

    const deleteBtn= document.querySelectorAll(".deleteBtn");
    //DOM元素 this指向會改變 不會指向app
    deleteBtn.forEach(btn=>{
        btn.addEventListener("click", app.delete);
  // 嘗試使用老師講解說的bind方法 改成this.delete.bind(this)，並將delete函式內以this重寫，
  // 卻無法強制綁定(?)。會出現以下錯誤
  // product_list.js:47 Uncaught (in promise) TypeError: Cannot read property 'bind' of undefined
  // at product_list.js:47
  // at NodeList.forEach (<anonymous>)
  // at product_list.js:46
  // at Array.forEach (<anonymous>)
  // at product_list.js:25
    
    
                        })


    })

})


}

,delete(e){
    //點擊刪除 刪除產品 渲染
 const id = e.target.dataset.id;
 axios.delete(`${app.data.url}api/${app.data.path}/admin/product/${id}`)
 .then(res=>{
     console.log(res);
     app.render();
 })

}
}

app.init()
app.render()


