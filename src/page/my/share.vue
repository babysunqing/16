<template>
<div class="container" v-title="'邀请有奖'">
  <img :src="url+param" alt=""> 
</div>
</template>

<script>
import { Base64 } from 'js-base64'
export default {
  name: 'myOrder',
  data () {
    return {
      state:'',
      url:'http://qr.liantu.com/api.php?&w=600&m=5&text=',
      param:'',
      urlInfo:{
        userId:'',
        firstClassSellerMemberId:''
      }
    }
  },
  created(){
    this.urlInfo.userId = JSON.parse(sessionStorage.getItem('myInfo')).userId
    this.urlInfo.firstClassSellerMemberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
    this.state = Base64.encode(JSON.stringify(this.urlInfo))
    
    this.text1 = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3fe5b092e95d247b&redirect_uri=http://test1.21d.me/bestlifeweb/html/index.html&response_type=code&scope=snsapi_userinfo&state='

    // this.text1 = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe2ea6975588ca6a0&redirect_uri=http://16.21d.me/bestlifeweb/html/index.html&response_type=code&scope=snsapi_userinfo&state='
    
    this.text2 = '#wechat_redirect'
    this.param = this.text1 + this.state +this.text2
    this.param = encodeURIComponent(this.param)
  },
  methods:{}
}
</script> 

<style scoped>
.container{
  width: 100%;
  height: 100%;
  background-color: #f3f3f3;
  background: url(../../assets/bg1.png) no-repeat;
  background-size:100% 100%;
}
img{
  width: 3.8rem;
  height: 3.8rem;
  margin-top: 58.5vh;
  margin-left: 1.3rem
}
</style>