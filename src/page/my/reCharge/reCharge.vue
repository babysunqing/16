<template>
<div class="container" v-title="'充值'">
	<div class="content">
    <p class="name">账户金额：<span>{{ myInfo.balance / 100}}元</span></p>

    <p class="card">充值金额：</p>
    <input class="nameInput"  type="number"  name="" placeholder="请输入充值金额" v-model="createWXPaymentVo.payNum" />

    <div class="moneyContent one" @click="userInput(num[0])">{{ num[0] }}元</div>
    <div class="moneyContent" @click="userInput(num[1])">{{ num[1] }}元</div>
    <div class="moneyContent" @click="userInput(num[2])">{{ num[2] }}元</div>
    <div class="moneyContent one two" @click="userInput(num[3])">{{ num[3] }}元</div>
    <div class="moneyContent two" @click="userInput(num[4])">{{ num[4] }}元</div>
    <div class="moneyContent two" @click="userInput(num[5])">{{ num[5] }}元</div>

    <p class="card rechargeWay">充值方式：</p>
    <!-- <div class="moneyContent one">银联卡</div> -->
    <div class="moneyContent" style="margin-left:.45rem">微信支付</div>

    <div class="submit" @click="submit()">下一步</div>
  </div>
</div>
</template>

<script src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js" type="text/javascript" charset="utf-8"></script>
<script>
import axios from 'axios'
import { Base64 } from 'js-base64'
import wx from 'weixin-js-sdk'
export default {
  name: 'reCharge',
  data () {
    return {
      num: [100, 200, 500, 1000, 2000, 5000] ,
      createWXPaymentVo: {
        memberId: '',
        memberPayNum: 0,
        payNum:''
      },
      myInfo:{
        balance: 0
      }
    }
  },
  created () {
    let self = this
    if(sessionStorage.getItem('myInfo') != null){
      this.myInfo = JSON.parse(sessionStorage.getItem('myInfo'))
    }
    // this.url = window.location.href
    this.url = 'http://16.21d.me/bestlifeweb/html/index.html'
    this.url = encodeURI(encodeURI(Base64.encode(this.url)))
    axios.get('/bestlifeweb/member/jssdkConfigHelper?url=' + self.url).then(function (res) {
      self.data = res.data.data
      wx.config({
          debug: false,
          appId: self.data.appId,
          timestamp:self.data.timestamp,
          nonceStr: self.data.noncestr,
          signature: self.data.signature,
          jsApiList: ['chooseWXPay']
      })
    }).catch(function(err){
        alert(err.response.data)
      })

  },
  methods:{
    userInput: function (num) {
      // debugger
      this.createWXPaymentVo.payNum = num
    },
    submit: function () {
      if(sessionStorage.getItem('myInfo') != null && JSON.parse(sessionStorage.getItem('myInfo')).userId == '1'){
          alert('在此经销商下无法使用此功能')
          return
      }
      if(sessionStorage.getItem('myInfo') == null){
        alert('请登录后再充值')
        return
      }
      if (this.createWXPaymentVo.payNum == null || this.createWXPaymentVo.payNum == 0) {
        alert('输入金额有误')
        return
      }
      this.createWXPaymentVo.memberPayNum = parseFloat(this.createWXPaymentVo.payNum) * 100     
      this.createWXPaymentVo.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
      // alert(this.createWXPaymentVo.memberId)
      let self = this
      axios({
        method: 'post',
        url: '/bestlifeweb/memberPayment/memberWXPayment',
        headers: {'Content-Type': 'application/json'},
        data: self.createWXPaymentVo
      }).then(function (res) {

        wx.chooseWXPay({
          appId: res.data.data.appId,
          timestamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          success: function(res) {
              // 支付成功后的回调函数
              if (res.errMsg == "chooseWXPay:ok") {
                  alert('支付成功')
                  window.history.go(-1)
              } else {
                  alert(res.errMsg)
              }
          },
          cancel: function(res) {
              alert('支付取消')
          }  
        })

        // self.$router.replace({name: 'reChargeSuccess', params: {memberPayInfo:JSON.stringify(self.memberPayInfo)}})
      }).catch(function(err){
          alert(err)
      })
    }
  }  
}
</script> 

<style scoped>
.container{
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #f3f3f3;
  padding-top: .24rem;
}
.content{
  width: 94vw;
  height: auto;
  margin-left: 3vw;
  background-color: #fff;
  border-radius: .1rem;
  box-shadow: .02rem .03rem #f3e0e0;
  padding-top: .45rem;
  padding-bottom: .68rem;
  position: relative;
}
.name{
  margin-top: 0;
  margin-bottom: 0;
  font-size: .32rem;
  color: #333;
  margin-left: .45rem;
}
.name span{
  color: #ff8452;
}
.nameInput{
  width: 85%;
  margin-bottom: 0;
  padding-bottom: .14rem;
  margin-left: .45rem;
  border: 0;
  border-bottom: .01rem solid #ef5455;
  position: absolute;
  top: 2.1rem;
  font-size: .28rem;
  color: #333;
}
input {outline:none;}
::-webkit-input-placeholder {
　　color:#999;
}
.card{
  margin-top: .5rem;
  margin-bottom: 0;
  font-size: .32rem;
  color: #333;
  margin-left: .45rem;
}
.rechargeWay{
  clear: both;
  position: absolute;
  top: 5rem;
}
.moneyContent{
  width: 1.55rem;
  height: .8rem;
  margin-left:.2rem;
  margin-top: 1.2rem;
  border: .01rem solid #efefef;
  border-radius: .1rem;
  font-size: .28rem;
  color: #333;
  text-align: center;
  line-height: .8rem;
  float: left;
}
.one{
  margin-left: .45rem;
}
.two{
  margin-top: .2rem;
}
.submit{
  width: 88%;
  height: .84rem;
  margin-top: 6rem;
  margin-left: 6%;
  background-color: #ef5455;
  border-radius: .42rem;
  font-size: .34rem;
  color: #fff;
  text-align: center;
  line-height: .84rem;
}
</style>
