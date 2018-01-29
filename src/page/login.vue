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

    <router-link to="/register">  
      <div class="register">立即注册</div>
    </router-link>

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
      phone:'',
      countdown: 0,
      identifyingCode:'',
      userInputCode:'',
      memberLoginInfo:{
        openid: '',
        type: 'wx'
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
    getCode: function () { //获取短信验证码
      if(this.phone.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(this.phone)){
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
    submit: function () {
      let self = this
      if(this.phone === ''){
        alert('请填写手机号')
        return
      }
      if(this.identifyingCode != this.userInputCode || this.identifyingCode === ''){
        alert('验证码输入错误，请重试！')
        return
      }
      this.memberLoginInfo.openid = sessionStorage.getItem('openid')
      this.memberLoginInfo.phone = this.phone
      axios({
        method: 'post',
        url: '/bestlifeweb/member/memberLogin',
        headers: {'Content-Type': 'application/json'},
        data: self.memberLoginInfo
        }).then(function (res) {
          self.userId = sessionStorage.getItem('userId')
          self.resData = res.data.data
          sessionStorage.setItem("allMember",JSON.stringify(self.resData))
          self.indexForUrlUserId = -1
          self.indexForMemberChooseDefaultUserId = -1
          self.indexForDefaultUser = -1
          
          if(self.resData != null && self.resData.length > 0){
            // 初始化
            for(var i = 0; i < self.resData.length; i++){
              // url上对应的userId下标，有在此代理商注册过
              if(self.resData[i].member.userId == self.userId){
                self.indexForUrlUserId = i  
              }
              // 默认经销商的下标 ，有默认经销商
              if(self.resData[i].member.wxDefaultUser == 1){
                self.indexForMemberChooseDefaultUserId = i 
              }
              // 平台给的经销商的下标，在1注册过
              if(self.resData[i].member.userId == '1'){
                self.indexForDefaultUser = i 
              }
            }
          }

          // 从公众号进入
          if(self.userId == '1'){
            // 没有注册过
            if(self.resData == null || self.resData.length == 0){
              // 到1 代理商注册
              alert('此手机号没有注册，立即注册？')
              self.$router.push({path:'/register'})
              return
            }else{
              // 有注册过，判断有没有默认代理商
              // 没有默认的代理商
              if(self.indexForMemberChooseDefaultUserId == -1){
                // alert('从1进来,没有有默认经销商')
                var index = self.indexForDefaultUser
                var member = self.resData[index].member
                sessionStorage.setItem("myInfo",JSON.stringify(member))
                sessionStorage.setItem("memberId",member.memberId)
                sessionStorage.setItem("userId",member.userId)
                self.$router.replace({path:'/my'})
              }else{
                // 有默认 进入到默认
                // alert('从1，进来有默认经销商')
                var index = self.indexForMemberChooseDefaultUserId
                var member = self.resData[index].member
                sessionStorage.setItem("myInfo",JSON.stringify(member))
                sessionStorage.setItem("memberId",member.memberId)
                sessionStorage.setItem("userId",member.userId)
                self.$router.replace({path:'/my'})
                return
              }
            }
          }

          // 从其他经销商进来，比如A
          if(self.userId != '1'){
            debugger
            // 没有在A注册过
            if(self.indexForUrlUserId == -1){
              // 去A注册
              // alert('从A进来,没有在A注册过')
              alert('此手机号没有注册，立即注册？')
              self.$router.push({path:'/register'})
              return
            }else{
              //  有在A注册过，进入a,进入我的页面之后，自动设A为默认
              // alert('从A进来,有在A注册过')
              var member = self.resData[self.indexForUrlUserId].member
              sessionStorage.setItem("myInfo",JSON.stringify(member))
              sessionStorage.setItem("memberId",member.memberId)
              sessionStorage.setItem("userId",member.userId)
              self.$router.replace({path:'/my'})
              return
            }
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