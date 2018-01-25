<template>
<div class="container" v-title="'余额提现'">
  <div class="content">
    
    <p class="name" v-if="bankCard.bankName == '' || bankCard.bankName == undefined">到账账户：<span @click="chooseBankCard()">请添加银行卡</span></p>
    <p class="name" v-if="bankCard != '' && bankCard.bankName != undefined">到账账户：<span @click="chooseBankCard()">{{bankCard.bankName}}({{ cardNum }})</span></p>

    <p class="card">提现金额：</p>
    <span class="little">¥</span>
    <input class="nameInput"  type="number" name=""  v-model="memberPayoffInfo.payoffNum" />
    <p class="balance">可提余额：¥ {{ myInfo.balance/100 }}</p>
    <p class="balance one">冻结余额：¥ {{ myInfo.freezeMoney /100 }}</p>
    <p class="balance two">总余额：¥ {{(myInfo.balance + myInfo.freezeMoney )/100 }}</p>
    <div class="submit" @click="submit()">提现</div>
    <h2>7个工作日之内到账</h2>
  </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'withdraw',
  data () {
    return {
      cardNum:'',
      bankCard:{},
      myInfo:{},
      memberPayoffInfo:{
        memberId: '',
        memberPayoffBankcardId: '',
        memberPayoffType: '' //分为wx和bank
      }
    }
  },
  created () {
    let self = this
    this.myInfo = JSON.parse(sessionStorage.getItem('myInfo'))
    if( typeof(this.$route.params.bankCard) != "undefined"){
      this.bankCard = JSON.parse(this.$route.params.bankCard)
      this.cardNum = this.bankCard.bankcardId
      this.cardNum = self.cardNum.substring(self.cardNum.length-4,self.cardNum.length)
    }else{
      this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
      axios.get('/bestlifeweb/bankcard/getMemberBankcardInfoList?memberId=' + self.memberId)
      .then(function (res) {
        self.bankCard = res.data.data[1]
        self.cardNum = self.bankCard.bankcardId
        self.cardNum = self.cardNum.substring(self.cardNum.length-4,self.cardNum.length)
      })
    }
  },
  methods:{
    chooseBankCard:function(){
      this.$router.replace({name: 'chooseBankCard'})
    },
    submit: function () {
      if(this.memberPayoffInfo.payoffNum == null || this.memberPayoffInfo.payoffNum == 0 || this.memberPayoffInfo.payoffNum * 100 > this.myInfo.balance ){
        alert('输入金额有误')
        return
      }
      this.memberPayoffInfo.memberPayoffTotalNum = parseFloat(this.memberPayoffInfo.payoffNum) * 100     
      this.memberPayoffInfo.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
      this.memberPayoffInfo.memberPayoffBankcardId = this.bankCard.bankcardId
      if(this.memberPayoffInfo.memberPayoffBankcardId != '')
        this.memberPayoffInfo.memberPayoffType = 'bank'
      else this.memberPayoffInfo.memberPayoffType = 'wx'
      let self = this
      axios({
        method: 'post',
        url: '/bestlifeweb/memberPayoff/memberPayoffRequest',
        headers: {'Content-Type': 'application/json'},
        data: self.memberPayoffInfo
      }).then(function (res) {
        self.$router.replace({name: 'withdrawSubmit', params: {memberPayoffInfo:JSON.stringify(self.memberPayoffInfo)}})
      }).catch(function(err){
          alert(err)
          self.$messagebox("提现失败,请检查网络是否异常!")
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
  -webkit-overflow-scrolling : touch;
}
.content{
  width: 94vw;
  height: auto;
  margin-left: 3vw;
  background-color: #fff;
  border-radius: .1rem;
  box-shadow: .02rem .02rem #f3e0e0;
  padding-top: .42rem;
  padding-bottom: .5rem;
  position: relative;
}
.name{
  margin-top: 0;
  margin-bottom: 0;
  font-size: .32rem;
  color: #333;
  margin-left: .46rem;
}
.name span{
  font-size: .32rem;
  color: #ff8452;
}
.nameInput{
  width: 80%;
  height: 1rem;
  margin-left: .4rem;
  padding-left: .6rem;
  border: 0;
  border: none;
  padding-bottom: .2rem;
  border-bottom: .01rem solid #e6e6e6;
  position: absolute;
  top: 2.28rem;
  font-size: .96rem;
  color: #333;
  font-weight: bold;
}
input {outline:none;}
.card{
  margin-top: .7rem;
  margin-bottom: 0;
  font-size: .32rem;
  color: #333;
  margin-left: .46rem;
}
.little{
  position: absolute;
  left: .46rem;
  top: 2.4rem;
  font-size: .6rem;
  color: #666;
  z-index: 1
}
.balance{
  font-size: .26rem;
  color: #666;
  position: absolute;
  top: 3.64rem;
  margin-left: .46rem;
}
.one{
  font-size: .26rem;
  color: #666;
  position: absolute;
  top: 4.05rem;
  margin-left: .46rem;
}
.two{
  font-size: .26rem;
  color: #666;
  position: absolute;
  top: 4.45rem;
  margin-left: .46rem;
}
.submit{
  width: 88%;
  height: .84rem;
  margin-top: 3.5rem;
  margin-bottom: .24rem;
  margin-left: 6%;
  background-color: #ef5455;
  border-radius: .42rem;
  font-size: .34rem;
  color: #fff;
  text-align: center;
  line-height: .84rem;
}
h2{
  font-size: .26rem;
  color: #666;
  font-weight: normal;
  text-align: center;
}
</style>