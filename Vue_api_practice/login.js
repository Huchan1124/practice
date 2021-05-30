const app = {
 data(){
     return {
        url:"https://vue3-course-api.hexschool.io/",
        user:{
            username:"",
            password:"",
        },
     };
 },

 methods: {
     login(){
     const api = `${this.url}admin/signin`;
         
     axios.post(api,this.user)
     .then(res=>{
         res.data.success ?  window.location = "./product_list.html" : alert(res.data.message);
         const {token,expired} = res.data;
         //將token存入cookie
         document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;


        /*寫法二 
         if(res.data.success){
           //  const token = res.data.token;
           //  const expired = res.data.expired;
         const {token,expired} = res.data;
           //將token存入cookie
         document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
         window.location = "./product_list.html";
         } else {
             alert(res.data.message);
         }*/
        
     })
     .catch(error=>{
        console.log(error);
     })
     
        }
     
 },



}

Vue.createApp(app).mount("#app");