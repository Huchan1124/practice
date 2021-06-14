// 前台購物車 串api
// 1. 取得商品資料 GET getProducts()
// 2. 單一產品細節 GET getProduct()
// 3. 加入購物車 POST addCart()
// 4. 購物車列表 GET getCart()
// 5. 刪除購物車項目（單一、全部） DELETE delete
// 6. 調整購物車產品數量
// 7. 結帳付款 
import userProductModal from './userProductModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'alicialo';

const app = Vue.createApp({
    data(){
        return{
            loadingStatus: {
                loadingItem: '',
              },
            products:[], //全部商品
            product:{}, //單一商品
            cart:{}, //購物車
             // 表單結構
            form: {
              user: {
                name: '',
                email: '',
                tel: '',
                address: '',
              },
              message: '',
            },
           

        }
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
    methods: {
        // 1. 取得商品資料
        getProducts(page=1){
            const url=`${apiUrl}/api/${apiPath}/products?page=${page}`;
            axios.get(url)
            .then( res=>{
                // console.log(res.data.products);
                if (res.data.success){
                    this.products = res.data.products;
                } else {
                    alert(res.data.message);
                }
            }   
            )
            .catch(error=>{
                console.log(error);
            })
        },
        // 2. 單一產品細節 GET
        getProduct(id){
            const url=`${apiUrl}/api/${apiPath}/product/${id}`;
            this.loadingStatus.loadingItem = id;
            axios.get(url)
            .then(res=>{
                if (res.data.success){
                this.loadingStatus.loadingItem = "";
                this.product=res.data.product;
                this.$refs.userProductModal.openModal();
                
               
                }
                else {
                    alert(res.data.message);
                }
            })
            .catch(error=>{
                console.log(error);
            })

        },
        // 3.加入購物車
        addToCart(id,qty=1){
            const url = `${apiUrl}/api/${apiPath}/cart`;

            this.loadingStatus.loadingItem = id;
            const cart ={
                product_id: id,
                qty
            };
            
            this.$refs.userProductModal.hideModal();

            axios.post(url,{data:cart})
            .then((res)=>{
                if (res.data.success) {
                    alert(res.data.message);
                    this.loadingStatus.loadingItem = '';
                    this.getCart();
                  
                  } else {
                    alert(res.data.message);
                  }
            })
            .catch(error=>{
                console.log(error);
            })

        },
        // 4.取得購物車列表
        getCart(){
            const url = `${apiUrl}/api/${apiPath}/cart`;
            axios.get(url)
            .then(res=>{
                if (res.data.success){
                    this.cart = res.data.data;
                } else {
                    alert(res.data.message);
                }
            })
            .catch(error=>{
                console.log(error);
            })

        },
        // 5.刪除全部購物車
        deleteAllCarts(){
            const url= `${apiUrl}/api/${apiPath}/carts`;
            axios.delete(url)
            .then(res=>{
                if(res.data.success){
                    alert(res.data.message);
                    // 重新渲染
                    this.getCart();
                } else {
                    alert(res.data.message);
                }
            })
            .catch(error=>{
                console.log(error);
            })
        },

        // 6.刪除單一購物車
        removeCartItem(id){
        const url= `${apiUrl}/api/${apiPath}/cart/${id}`;
        this.loadingStatus.loadingItem = id;
        axios.delete(url)
        .then(res=>{
            if(res.data.success){
                alert(res.data.message);
                // 重新渲染
                this.getCart();
            } else {
                alert(res.data.message);
            }
           })
           .catch(error=>{
            console.log(error);
           })
        },

        // 7.更新購物車
        updateCart(data){
            // 帶入購物車資料
            this.loadingStatus.loadingItem = data.id;
            const url= `${apiUrl}/api/${apiPath}/cart/${data.id}`;
            const cart = {
                product_id: data.product_id,
                qty: data.qty,
              };
              axios.put(url, { data: cart })
              .then((res) => {
                if(res.data.success) {
                  alert(res.data.message);
                  this.loadingStatus.loadingItem = '';
                  this.getCart();
                } else {
                  alert(res.data.message);
                  this.loadingStatus.loadingItem = '';
                }
              })
              .catch(error=>{
                console.log(error);
               });
        },
        //送出表單
        createOrder() {
            const url = `${apiUrl}/api/${apiPath}/order`;
            const order = this.form;
            axios.post(url, { data: order })
            .then((res) => {
              if (res.data.success) {
                alert(res.data.message);
                // 清空表單
                this.$refs.form.resetForm();
                // 清空留言欄位
                this.form.message='',
                this.getCart();
              } else {
                alert(res.data.message)
              }
            })
            .catch(error=>{
                console.log(error);
               });
        },
          
      
     
    
        
    },
})

// 註冊驗證元件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

//驗證規則
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json'); //多國語系

VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
  });

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });

app.component('userProductModal', userProductModal)
app.mount('#app')