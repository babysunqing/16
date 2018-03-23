<template>
<div class="container" v-title="'登录'">
  <h1>登录</h1>
  <div class="content">
    <input class="nameInput" 
      type="tel"  
      pattern="[0-9]*" 
      name="" 
      placeholder="请输入手机号"
      v-model="phone" />

    <input class="cardInput" 
      type="number" 
      name="" 
      placeholder="请输入验证码" 
      v-model="userInputCode" />

    <span id="loginBtn" @click="getCode()">获取验证码</span>
    <div class="submit" @click="submit()">提交</div>
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
      canPost:true,
      phone:'',
      countdown: 0,
      identifyingCode:'',
      userInputCode:'',
      memberLoginInfo:{
        openid: '',
        type: 'wx'
      },
      memberRegisterInfo:{
        phone: '',
        firstClassSellerMemberId: '',
        userInfo:{},
        openid:'',
        userId: '',
        type:'wx'
      }
    }
  },
  methods:{
    setTime: function () {
      let self = this
        if (self.countdown === 0) {
          document.getElementById('loginBtn').innerHTML = '重新获取'
          return
        } else {
          document.getElementById('loginBtn').innerHTML = '' + this.countdown + 's后重试'
          this.countdown--
        }
        setTimeout(function () {   
          self.setTime()     
        }, 1000) 
    },
    //获取短信验证码
    getCode: function () {
      if(this.phone.length == 11 && /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/.test(this.phone)){
        if(this.countdown > 0){
          return
        }else{
          let self = this
          axios.get('/bestlifeweb/member/getVerificationCode?phone=' + this.phone).then(function (res) {
            self.identifyingCode = res.data.data
          })
          this.countdown = 60 
          this.setTime()
        }
      }else{
        alert('请填写正确的手机号码！')
      }        
    },
    memberRegister: function(){
      let self = this
      this.memberRegisterInfo.firstClassSellerMemberId = JSON.parse(sessionStorage.getItem('urlMemberInfo')).firstClassSellerMemberId
      this.memberRegisterInfo.openid = sessionStorage.getItem('openid')
      this.memberRegisterInfo.userId = sessionStorage.getItem('userId')
      this.memberRegisterInfo.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.memberRegisterInfo.phone = this.phone

      axios({
        method: 'post',
        url: '/bestlifeweb/member/memberRegister',
        headers: {'Content-Type': 'application/json'},
        data: self.memberRegisterInfo
      }).then(function (res) {
        if(res.data.code == 0){
          self.member = res.data.data
          sessionStorage.setItem("myInfo",JSON.stringify(self.member))
          sessionStorage.setItem("memberId",self.member.memberId)
          sessionStorage.setItem("userId",self.member.userId)
          self.$router.replace({path:'/my'})
        }else if(res.data.code == 1){
          alert('errmsg' + res.data.errmsg)
        }
      }).catch(function(error){
          alert('error.data' + JSON.stringify(error.response.data))
          alert('error.status' + error.response.status)
      })
    },
    setData: function () {

    },
    submit: function () {
      let self = this
      // if(this.canPost == false){
      //   return
      // }
      if(this.phone === ''){
        alert('请填写手机号')
        return
      }
      if(this.identifyingCode != this.userInputCode || this.identifyingCode == ''){
        alert('验证码输入错误，请重试！')
        return
      }
      axios.get('/bestlifeweb/member/memberLogin?phone=' + this.phone).then(function (res) {
        localStorage.setItem('phone', self.phone)
        if(res.data.code == 0){
            self.member = res.data.data[0].member
            sessionStorage.setItem("myInfo",JSON.stringify(self.member))
            sessionStorage.setItem("memberId",self.member.memberId)
            sessionStorage.setItem("userId",self.member.userId)
            self.$router.replace({path:'/my'})
        }else if(res.data.code == 1){
            self.memberRegister()
        }
      }).catch(function(error){
          alert(JSON.stringify(error.response.data))
      })
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
  margin-top: 3.2rem;
  margin-left: 9%;
  background-color: #ef5455;
  border-radius: .42rem;
  font-size: .34rem;
  color: #fff;
  text-align: center;
  line-height: .84rem;
}
.register{
  font-size: .26rem;
  position: absolute;
  top:4.7rem;
  right: 42%;
  color: #ef5455;
}
</style>