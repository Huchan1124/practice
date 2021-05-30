// null 和 空字串差別 null長度是null，不確定佔用了多少儲存空間，但是有佔用儲存空間 空字串長度是0，不佔用空間
let productModal = null;
let delProductModal = null;

const app = {
    //資料
    data(){
        return{        
            url:"https://vue3-course-api.hexschool.io/",
            path:"alicialo",
            products: [],
            isNew: false,
            tempProduct: {
              imagesUrl: [],
             }
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
        //取得產品
        getData(page=1){
            axios.get(`${this.url}api/${this.path}/admin/products?page=${page}`)
            .then(res=> {
                (res.data.success)? this.products= res.data.products : alert(res.data.messages);
            })
            .catch(error =>{
                console.log(error);
            })
        },
        //新增產品
        updateProduct() {
            //因為post put 的axios寫法架構類似，下方的寫法讓code看起來較簡潔
            //新增
            let url = `${this.url}api/${this.path}/admin/product`;
            let http = 'post';
            //編輯 !this.isNew 如果是false
            if(!this.isNew) {
             url = `${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`;
             http = 'put';
             }
             //帶入 { data: this.tempProduct } 資料
             axios[http](url,{ data: this.tempProduct })
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
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
    }
}

Vue.createApp(app)
.mount("#app") //指定位置(通常指定於Dom元素 id)





