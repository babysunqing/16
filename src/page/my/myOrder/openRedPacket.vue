<template>
<div class="container" v-title="'拆红包'">
  <input type="radio" id="odd" class="regular-radio odd"    name="redpacket" value="first" v-model="redpacketNo" />
  <label for="odd"></label>  

  <input type="radio" id="even"  class="regular-radio even" name="redpacket" value="second" v-model="redpacketNo" />
  <label for="even"></label>  

  <div class="exit" @click="submitRoot()" v-if="flag == true">立即升级</div>
  <!-- 升级成功，弹出 -->
  <mt-popup class="popContent" v-model="popup" popup-transition="popup-fade">
    <div>
      <img src="../../../assets/succeed_img.png" @click="toMyPage()">
    </div>
  </mt-popup>

  <!-- 升级失败，弹出 -->
  <mt-popup class="popContent" v-model="popupFail" popup-transition="popup-fade">
    <div>
      <img src="../../../assets/fail_img.png" @click="toMyPage()">
    </div>
  </mt-popup>

  <!-- -->
  <mt-popup class="popContent" v-model="countDown" popup-transition="popup-fade">
    <p>
      {{countSecond}}
    </p>
  </mt-popup>

</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'myOrder',
  data () {
    return {
      flag: true,
      rate: 0,
      popup: false,
      popupFail: false,
      countDown: false,
      countSecond: 5,
      redpacketNo: '',
      random: '',
      lotteryFromRootOrderVo: {
        lotteryOddEvenChoose: '',
        lotteryResult: '',
        lotteryType: 'redpacket',
        rootOrderId: ''
      },
      memberLoginInfo:{
        openid:'',
        type: 'wx'
      }
    }
  },
  created(){
    //获取猜中几率
    let self = this
    this.userId = sessionStorage.getItem('userId')
    axios.get('/bestlifeweb/user/getUserInfo?userId=' + self.userId).then(function (res) {
        self.rate = res.data.data[0].redpacketSuccessRate
    })

    this.phone = localStorage.getItem('phone')
    axios.get('/bestlifeweb/member/memberLogin?phone=' + this.phone).then(function (res) {
      self.myInfo = res.data.data[0].member
      self.balance = self.myInfo.balance
      sessionStorage.setItem("myInfo",JSON.stringify(self.myInfo))
    }).catch(function(error){
        alert(JSON.stringify(error.response.data))
    })
  },
  methods:{
    toMyPage: function(){
      this.$router.replace({name: 'myOrder'})
    },
    lottery: function(){
      let self = this
      this.lotteryFromRootOrderVo.rootOrderId = JSON.parse(self.$route.params.rootOrder).rootOrderId
      axios({
        method: 'post',
        url: '/bestlifeweb/order/memberLotteryFromRootOrder',
        headers: {'Content-Type': 'application/json'},
        data: self.lotteryFromRootOrderVo
      }).then(function (res) {
        self.flag = false
      })
    },
    countDowning: function(){
      //打开弹窗
      let self = this
      if(self.countSecond == 0){
        // 关闭倒计时弹窗
        self.countDown = false
        // 打开猜红包结果
        self.doGuess()
        // 回到初始值
        setTimeout(function(){
          self.countSecond = 5
        },500)
        // 返回
        return false
      }
      else if(self.countSecond > 0){
      //延时执行
        this.countDown = true
        setTimeout(function(){
          self.countSecond --
          self.countDowning()
        },1000)
      }
    },
    doGuess: function(){
      //随机结果
      var num = Math.random()*100 + 1
      this.random = parseInt(num, 10)
      if(this.random <= this.rate){
        this.lotteryFromRootOrderVo.lotteryResult = 'success'
        this.popup = true
        this.lottery()
      }else{
        this.lotteryFromRootOrderVo.lotteryResult = 'fail'
        this.popupFail = true
        this.lottery()
      }
    },
    submitRoot: function(){
      var rootOrder = JSON.parse(this.$route.params.rootOrder)
      var lotteryRate = sessionStorage.getItem('lotteryRate')/100
      if(this.balance < rootOrder.payPrice * rootOrder.orderNum * lotteryRate ){
        alert('余额不足，无法升级！')
        return
      }

      if(this.flag == true){
        if(this.redpacketNo === ''){
          alert('请先选中红包！')
          return
        }
        this.flag = false
        //进入倒计时
        this.countDowning()
      }else{
        alert('不能重复升级')
      }
      
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
  -webkit-overflow-scrolling : touch;
  background: url(../../../assets/bg.png) no-repeat;
  background-size:100% 100%;
}
.exit{
  width: 74%;
  height: .88rem;
  background-color: #fe5455;
  margin-left: 13%;
  border-radius: 30px;
  font-size: .34rem;
  color: #fff;
  line-height: .88rem;
  text-align: center;
  position: fixed;
  bottom: 2rem;
}
.regular-radio {
  display: none;
}
.regular-radio + label {
  width: 1.86rem;
  height: 1.58rem;
  background-size: 100%;
  margin-top: 50vh;
  -webkit-appearance: none;
  display: inline-block;
  position: relative;
}
.odd + label{
  left: 13vw;
  background-image: url(../../../assets/bag_n.png);
}
.odd:checked + label{
  background-image: url(../../../assets/bag_s.png);
  left: 13vw;
}
.even + label{
  left: 22vw;
  background-image: url(../../../assets/bag_n.png);
}
.even:checked + label{
  background-image: url(../../../assets/bag_s.png);
  left: 22vw;
}
.regular-radio:checked + label:after {}
.popContent img{
  width: 4.04rem;
  height: 4.62rem
}
.popContent{
  border-radius: .19rem;
  text-align: center;
}
p{
  width: 2.8rem;
  height: 3.51rem;
  font-size: 1.85rem;
  color: #ff5231;
  background-color: #fff6d6;
  border-radius: .19rem;
  line-height: 3.15rem;
  margin-top: 0;
  margin-bottom: 0;
  padding-right: .45rem
}
</style>