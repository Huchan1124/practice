export default {  
    template: '#userProductModal',
    props:{
        product: {
          type: Object,
          default() {
            return {
            }
          }
        }
      },
   
    data(){
        return{
            status: {},
            modal:"",
            qty: 1, //購物車數量
        }
    },
    mounted() {
        //$ref 抓取頁面上的DOM
        this.modal = new bootstrap.Modal(this.$refs.modal,{
            keyboard: false,
            backdrop: 'static'
          });
    },
    methods:{
        openModal(){
            this.modal.show();
        },
        hideModal(){
            this.modal.hide();
        }

    }


}