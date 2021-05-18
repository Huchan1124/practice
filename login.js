;(function(){

const url = "https://vue3-course-api.hexschool.io/";
const path = "alicialo";

const emailInput = document.querySelector(".emailInput");
const passwordInput = document.querySelector(".passwordInput");
const loginBtn = document.querySelector(".loginBtn");


//當點擊登入，將email,password的值用api傳送給後端驗證
loginBtn.addEventListener("click",login)

function login(){

    const username = emailInput.value;
    const password = passwordInput.value;

    // const user={
    //     username:username,
    //     password:password
    // }
    // 屬性與值名稱相同可縮寫為
    const user={
            username,
            password
        }

    axios.post(`${url}admin/signin`, user)
    .then(res=>{console.log(res);
     //如果登入成功>導向產品頁面  失敗>取消預設行為
     res.data.success ? (window.location = './product_list.html'): alert("帳號密碼錯誤!");event.preventDefault();
     const token = res.data.token;
     const expired = res.data.expired;
     console.log(token,expired);
     //  header儲存cookie，每次登入都能重新找到token
     document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
     
    
    
    }

    )
   

}


//檢查是否持續登入
function checkLogin() {
    //取得token 
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token; //token加到header裡面

    axios.post(`${url}api/user/check`)
    .then(res=>{
        console.log(res);
    })

  }



})()


