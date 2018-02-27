<template>
<div class="container" v-title="'注册'">
  <h1>欢迎您注册</h1>
  <div class="content">
    <input class="nameInput" 
      type="tel"  
      pattern="[0-9]*" 
      name="" 
      placeholder="请输入手机号"
      v-model="memberRegisterInfo.phone" />

    <input class="cardInput" 
      type="number" 
      name="" 
      placeholder="请输入验证码" 
      v-model="userInputCode" />

    <span id="yzBtn" @click="getCode()">获取验证码</span>   
    <div class="submit" @click="submit()">提交</div>
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'register',
  data () {
    return {
      count: 0,
      identifyingCode:'',
      userInputCode:'',
      canPost: true,
      memberRegisterInfo:{
        phone: '',
        firstClassSellerMemberId: '',
        userInfo:{},
        openid:'',
        userId: '',
        type:'wx'
      },
       memberLoginInfo:{
        openid:'',
        type: 'wx'
      }
    }
  },
  methods:{
    setTime: function () {
      let self = this
        if (self.count === 0) {
          document.getElementById('yzBtn').innerHTML = '重新获取'
          return
        } else {
          document.getElementById('yzBtn').innerHTML = '' + this.count + 's后重试'
          this.count--
        }
        setTimeout(function () {   
          self.setTime()     
        }, 1000) 
    },
    getCode: function () { //获取短信验证码
      if(this.memberRegisterInfo.phone.length == 11 && /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/.test(this.memberRegisterInfo.phone)){
        if(this.count > 0){
          return
        }else{
          let self = this
          axios.get('/bestlifeweb/member/getVerificationCode?phone=' + this.memberRegisterInfo.phone).then(function (res) {
            self.identifyingCode = res.data.data
          })
          this.count = 60 
          this.setTime()
        }
      }else{
        alert('请填写正确的手机号码！')
      }        
    },
    login:function(){
      let self = this
      this.memberLoginInfo.phone = localStorage.getItem('phone')
      this.memberLoginInfo.openid = sessionStorage.getItem('openid')
      axios({
        method: 'post',
        url: '/bestlifeweb/member/memberLogin',
        headers: {'Content-Type': 'application/json'},
        data: self.memberLoginInfo
      }).then(function (res) {
        
      })
    },
    memberRegister: function(){
      let self = this
      this.memberRegisterInfo.firstClassSellerMemberId = JSON.parse(sessionStorage.getItem('urlMemberInfo')).firstClassSellerMemberId
      this.memberRegisterInfo.openid = sessionStorage.getItem('openid')
      this.memberRegisterInfo.userId = sessionStorage.getItem('userId')
      this.memberRegisterInfo.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.canPost = false
      // alert(JSON.stringify(this.memberRegisterInfo))
      axios({
        method: 'post',
        url: '/bestlifeweb/member/memberRegister',
        headers: {'Content-Type': 'application/json'},
        data: self.memberRegisterInfo
      }).then(function (res) {
        if(res.data.code == 0){
          localStorage.setItem('phone', self.memberRegisterInfo.phone)
          sessionStorage.setItem("myInfo",JSON.stringify(res.data.data))
          sessionStorage.setItem("memberId",res.data.data.memberId)
          self.$router.push({path:'/my'})
        }else if(res.data.code == 1){
          alert('errmsg' + res.data.errmsg)
        }
      }).catch(function(error){
          alert('error.data' + JSON.stringify(error.response.data))
          alert('error.status' + error.response.status)
      })
    },
    submit: function () {
      if(this.memberRegisterInfo.phone === ''){
        alert('请填写手机号')
        return
      }
      if(this.identifyingCode != this.userInputCode || this.identifyingCode === ''){
        alert('验证码错误，请重试！')
        return
      }
      if(this.canPost == true){
        // debugger
        this.memberRegister()
      }else if(this.canPost == false){
        alert('请勿重复提交')
      }
    }
  }
}
</script> 

<style scoped>
.container{
  width: 100%;
  height: 91%;
  padding-top: .24rem;
  background-color: #fff;
  overflow: auto;
  -webkit-overflow-scrolling : touch;
}
h1{
  font-size: .48rem;
  color: #333;
  font-weight: normal;
  text-align: center;
  margin-top: .6rem;
}
span{
  font-size: .26rem;
  color: rgba(239,84,85,0.8);
  position: absolute;
  right: .8rem;
  top: 2rem;
  border-left: .01rem solid #ddd;
  padding-left: .3rem;
}
.content{
  width: 100%;
  height: auto;
  background-color: #fff;
  border-radius: .1rem;
  padding-top: .3rem;
  padding-bottom: .68rem;
  position: relative;
}
.nameInput{
  width: 80%;
  margin-bottom: 0;
  padding-bottom: .1rem;
  margin-left: 10%;
  border: 0;
  border-bottom: .01rem solid rgba(239,84,85,0.5);
  position: absolute;
  top: 1rem;
  font-size: .24rem;
  color: #333;
  outline: none;
}
.cardInput{
  width: 80%;
  margin-bottom: 0;
  padding-bottom: .1rem;
  margin-left: 10%;
  border: 0;
  border-bottom: .01rem solid rgba(239,84,85,0.5);
  position: absolute;
  top: 2rem;
  font-size: .24rem;
  color: #333;
  outline: none;
}
::-webkit-input-placeholder {
　　color:#ccc;
}
.submit{
  width: 82%;
  height: .84rem;
  margin-top: 3.4rem;
  margin-left: 9%;
  background-color: #ef5455;
  border-radius: .42rem;
  font-size: .34rem;
  color: #fff;
  text-align: center;
  line-height: .84rem;
}
</style>