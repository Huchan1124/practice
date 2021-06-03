// null 和 空字串差別 null長度是null，不確定佔用了多少儲存空間，但是有佔用儲存空間 空字串長度是0，不佔用空間
let productModal = null;
let delProductModal = null;

const app = Vue.createApp({
    //資料
    data(){
        return{        
            url:"https://vue3-course-api.hexschool.io/",
            path:"alicialo",
            products: [],
            isNew: false,
            tempProduct: {
              imagesUrl: [],
             },
            // 新增pagination空陣列
            pagination:[]
    }},

    //生命週期
    mounted() {
     // var myModal = new bootstrap.Modal(document.getElementById('myModal'), options)
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

        //取得token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if (token===""){
            alert("您尚未登入請重新登入");
            window.location("./login.html");
        }
        //將token存入header
        axios.defaults.headers.common['Authorization'] = token;
        //渲染
        this.getData();
    },
    

    //方法
    methods:{
        //取得產品 //從131行傳入emit值 >接著記得到html 綁定事件(搭橋梁)(第216行)
        getData(page){
            axios.get(`${this.url}api/${this.path}/admin/products?page=${page}`)
            .then(res=> {
                if (res.data.success) {
                    this.products= res.data.products;
                    // 傳入pagination值
                    this.pagination = res.data.pagination;
                    console.log( this.pagination);
                    }  
                 else { alert(res.data.messages);};
            })
            .catch(error =>{
                console.log(error);
            })
        },
         //新增產品 *此處的tempProduct參數是由emit傳遞的(第277行)，因此此處tempProduct不使用this
         updateProduct(tempProduct) {
            //因為post put 的axios寫法架構類似，下方的寫法讓code看起來較簡潔
            //新增
            let url = `${this.url}api/${this.path}/admin/product`;
            let http = 'post';
            //編輯 !this.isNew 如果是false
            if(!this.isNew) {
             url = `${this.url}api/${this.path}/admin/product/${tempProduct.id}`;
             http = 'put';
             }
             //帶入 { data: this.tempProduct } 資料
             axios[http](url,{ data: tempProduct })
             .then((res) => {
                if(res.data.success) {
                  alert(res.data.message);
                  productModal.hide();
                  this.getData();
                } else {
                  alert(res.data.message);
                }
              })
              .catch(error =>{
                  console.log(error);
              })

        },
       

        deleteProduct(){
            axios.delete(`${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`)
            .then(res=>{
                if (res.data.success){
                    alert(res.data.message);
                    delProductModal.hide();
                    this.getData();
                } else {
                    alert(res.data.message);
                }
            })
            .catch(error =>{
                console.log(error);
            })

        },

        openModal(isNew,item){
            switch (isNew) {
                case 'new':
                  this.tempProduct ={
                    imagesUrl: [],
                  };
                  this.isNew = true;
                  productModal.show();
                  break;
                case 'edit':
                    this.tempProduct = { ...item };
                    this.isNew = false;
                    productModal.show();
                  break;
                case 'delete':
                    this.tempProduct = { ...item };
                    delProductModal.show()
                  break;
              }
        },
        
    }
})
// 定義元件 ('元件名稱(自定義)',內容)  父取得資料>props(父傳子)
app.component('pagination', {
    // props名稱(自定義)
    props:['page'],
    // 143行 用v-for 從props抓到的page裡生成頁碼 (Q.為何total_pages非陣列、物件可以用v-for輸出?=>解答:老師作業講解:v-for搭配數字的話，會按順序輸出ex.1 2 3 4)
    // 143行 $emit('自定義名稱',傳遞內容(頁碼)) 回去父層 getData 第41行(觸發點選頁碼更換頁面的效果)
    // 143 v-bind新增active值 高亮當前頁面 (Bootstrap語法> active)當item 等於current_page 時 ，true 則顯示active屬性
    // 139行 145行 (Bootstrap語法> disabled 下在li上) 如果沒有下一頁/上一頁就不能點
    template:`<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{'disabled': !page.has_pre  }">
        <a class="page-link"  @click="$emit('get-data', page.current_page-1)"  href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" :class="{'active': item === page.current_page }" v-for="item in page.total_pages" :key="item"><a class="page-link" @click="$emit('get-data',item)" href="#">{{item}}</a></li>
      <li class="page-item" :class="{'disabled': !page.has_next  }">
        <a class="page-link" @click="$emit('get-data', page.current_page+1)"  href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,
  created(){
    console.log(this.page);

},
 

})

app.component('productModal',{
    props:['tempProduct'],
    // 第277行，因為每個元件的資料都是獨立的，我們習慣在emit的時候再把資料送回去(第58行)
    template:` <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
    aria-hidden="true">
 <div class="modal-dialog modal-xl">
   <div class="modal-content border-0">
     <div class="modal-header bg-dark text-white">
       <h5 id="productModalLabel" class="modal-title">
         <span v-if="isNew">新增產品</span>
         <span v-else>編輯產品</span>
       </h5>
       <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
     </div>
     <div class="modal-body">
       <div class="row">
         <div class="col-sm-4">
           <div class="form-group">
             <label for="imageUrl">主要圖片</label>
             <input v-model="tempProduct.imageUrl" type="text" class="form-control" placeholder="請輸入圖片連結">
             <!-- v-bind 圖片網址 -->
             <img class="img-fluid" :src="tempProduct.imageUrl">
           </div>
           <div class="mb-1">多圖新增</div>
           <!-- Array.isArray()判斷是否為陣列 -->
           <div v-if="Array.isArray(tempProduct.imagesUrl)">
             <!--v-for 將 tempProduct.imagesUrl 裡的 資料印出 -->
             <div class="mb-1" v-for="(image, key) in tempProduct.imagesUrl" :key="'圖片'+key">
               <div class="form-group">
                 <label for="imageUrl">圖片網址</label>
                 <input v-model="tempProduct.imagesUrl[key]" type="text" class="form-control"
                   placeholder="請輸入圖片連結">
               </div>
               <img class="img-fluid" :src="image">
             </div>
             <!--   沒填寫內容    v-if= !0 || tempProduct.imagesUrl[- 1] -->
             <!--                v-if= true || undefined  -->
             <!--   有填寫內容     v-if= false || true  -->
             <!--   tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] 用途是判斷陣列前一個字串是否有填寫內容，只要有填寫內容就不會顯示按鈕 -->
             <div  
               v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]">
               <button class="btn btn-outline-primary btn-sm d-block w-100"
                 @click="tempProduct.imagesUrl.push('')">
                 新增圖片
               </button>
             </div>
             <div v-else>
               <!-- pop() 方法會移除並回傳陣列的最後一個元素。此方法會改變陣列的長度。 -->
               <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imagesUrl.pop()">
                 刪除圖片
               </button>
             </div>
           </div>
           <div v-else>
             <button class="btn btn-outline-primary btn-sm d-block w-100"
               @click="createImages">
               新增圖片
             </button>
           </div>
         </div>
         <div class="col-sm-8">
           <div class="form-group">
             <label for="title">標題</label>
             <input v-model="tempProduct.title" id="title" type="text" class="form-control" placeholder="請輸入標題">
           </div>

           <div class="row">
             <div class="form-group col-md-6">
               <label for="category">分類</label>
               <input v-model="tempProduct.category" id="category" type="text" class="form-control"
                      placeholder="請輸入分類">
             </div>
             <div class="form-group col-md-6">
               <label for="price">單位</label>
               <input v-model="tempProduct.unit" id="unit" type="text" class="form-control" placeholder="請輸入單位">
             </div>
           </div>

           <div class="row">
             <div class="form-group col-md-6">
               <label for="origin_price">原價</label>
               <input v-model.number="tempProduct.origin_price" id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價">
             </div>
             <div class="form-group col-md-6">
               <label for="price">售價</label>
               <input v-model.number="tempProduct.price" id="price" type="number" min="0" class="form-control"
                      placeholder="請輸入售價">
             </div>
           </div>
           <hr>

           <div class="form-group">
             <label for="description">產品描述</label>
             <textarea v-model="tempProduct.description" id="description" type="text" class="form-control"
                       placeholder="請輸入產品描述">
             </textarea>
           </div>
           <div class="form-group">
             <label for="content">說明內容</label>
             <textarea v-model="tempProduct.content" id="description" type="text" class="form-control"
                       placeholder="請輸入說明內容">
             </textarea>
           </div>
           <div class="form-group">
             <div class="form-check">
               <input v-model="tempProduct.is_enabled" id="is_enabled" class="form-check-input" type="checkbox"
                      :true-value="1" :false-value="0">
               <label class="form-check-label" for="is_enabled">是否啟用</label>
             </div>
           </div>
         </div>
       </div>
     </div>
     <div class="modal-footer">
       <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
         取消
       </button>
       <button type="button" class="btn btn-primary" @click="$emit('update-product',tempProduct)" >
         確認
       </button>
     </div>
   </div>
 </div>
</div>`,
    methods:{
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
        

    },
}
)

app.mount("#app") //指定位置(通常指定於Dom元素 id)





