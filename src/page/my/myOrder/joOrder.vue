<template>
<div class="container" v-title="'猜鸡藕'">
  <input type="radio" id="odd" class="regular-radio odd"  value="odd" v-model='lotteryFromRootOrderVo.lotteryOddEvenChoose' readonly="readonly" />
  <label for="odd"></label>  

  <input type="radio" id="even"  class="regular-radio even" value="even" v-model='lotteryFromRootOrderVo.lotteryOddEvenChoose' readonly="readonly" />
  <label for="even"></label>  

  <!-- 升级数据有的情况 -->
  <div class="itemContent" v-if="item.guessOddEven != null">
    <div class="item" style="width:100%;height:.45rem;
    float:left">
      <h1>订单编号：{{item.guessOddEven.guessOddEvenId}}</h1><h1>...</h1>
      <h2>{{day}} {{time}}</h2>
    </div>

    <div class="item">
      <h3>竞猜数据：
        <span style="font-size:.26rem"  v-if="item.lottery.lotteryOddEvenChoose == 'even'">藕</span>
        <span style="font-size:.26rem"  v-if="item.lottery.lotteryOddEvenChoose == 'odd'">鸡</span>
      </h3>
      
      <h4>竞猜结果：
        <span v-if="item.guessOddEven.oddEvenResult == 'odd'">鸡</span>
        <span v-if="item.guessOddEven.oddEvenResult == 'even'">藕</span>
      </h4>
    </div>

    <div class="item" style="padding-bottom:.3rem" >
      <h3>期数：<span style="font-size:.26rem;color:#ff8452">{{ item.guessOddEven.oddEvenPeriod }}</span></h3>
      <h4>是否猜中：
        <p style="font-size:.26rem" v-if="item.guessOddEven.oddEvenResult == item.lottery.lotteryOddEvenChoose">是</p>
        <p style="font-size:.26rem"  v-if="item.guessOddEven.oddEvenResult != item.lottery.lotteryOddEvenChoose">否</p>
      </h4>
    </div>

    <div class="item" style="padding-bottom:.3rem" >
      <h5>期数值：<p style="font-size:.26rem">{{ item.guessOddEven.oddEvenNum }}</p></h5>
    </div>

    <div class="backToOrder" @click="backToOrder()">立即查看</div>
  </div>

  <!-- 正在升级 -->
  <div class="itemContent" v-if="item.guessOddEven == null" style="margin-top:.3rem">

   <div class="item">
      <h3>竞猜数据：
        <span style="font-size:.26rem"  v-if="item.lottery.lotteryOddEvenChoose == 'even'">藕</span>
        <span style="font-size:.26rem"  v-if="item.lottery.lotteryOddEvenChoose == 'odd'">鸡</span>
      </h3>
      
      <h4>竞猜结果：
        <span>开奖中</span>
      </h4>      
    </div>

    <div class="item" style="padding-bottom:.3rem" >
      <h3>期数：<span style="font-size:.26rem;color:#ff8452">暂无数据</span></h3>
      <h4>期数值：
        <p style="font-size:.26rem">暂无数据</p>
      </h4>
    </div>

    <div class="backToOrder" @click="backToOrder()" style="line-height:.88rem;
    margin-top:1.5rem">开奖中...</div>
  </div>

</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'myOrder',
  data () {
    return {
      showData:false,       
      hiddenBotton:true,
      resData:{},
      lotteryFromRootOrderVo:{
        lotteryOddEvenChoose: '',
        lotteryResult: 'init',
        lotteryType: 'oddeven',
        rootOrderId: ''
      }
    }
  },
  created(){
    this.item = JSON.parse(this.$route.params.item)
    this.lotteryFromRootOrderVo.lotteryOddEvenChoose = this.item.guessOddEven.oddEvenResult
    // this.item.guessOddEven.oddEvenNum = this.item.guessOddEven.oddEvenNum.substring(0,11) 

    let day = this.item.guessOddEven.openTime
    this.day = new Date(parseInt(day) * 1000).toLocaleDateString()
    this.time = new Date(parseInt(day) * 1000).toLocaleTimeString('chinese',{hour12:false})
  },
  methods:{
    backToOrder:function(){
      this.$router.replace({name: 'myOrder'})
    },
    submitRoot: function(){
      if(this.lotteryFromRootOrderVo.lotteryOddEvenChoose == ''){
        alert('请先选择红包！')
        return
      }
      let self = this
      let day = (new Date().getTime()/1000).toFixed(0)
      this.day = new Date(parseInt(day) * 1000).toLocaleDateString()
      this.time = new Date(parseInt(day) * 1000).toLocaleTimeString('chinese',{hour12:false})

      this.lotteryFromRootOrderVo.rootOrderId = JSON.parse(this.$route.params.rootOrder).rootOrderId
      axios({
        method: 'post',
        url: '/bestlifeweb/order/memberLotteryFromRootOrder',
        headers: {'Content-Type': 'application/json'},
        data: self.lotteryFromRootOrderVo
      }).then(function (res) {
        self.resData = res.data.data
        self.resData.rootOrder.rootOrderId = self.resData.rootOrder.rootOrderId.substring(0,7) 
        self.showData = true 
        self.hiddenBotton = false      
      })
    }
  }  
}
</script> 

<style scoped>
.container{
  width: 100%;
  height: 100%;
  /*overflow: auto;*/
  background-color: #f3f3f3;
  /*-webkit-overflow-scrolling : touch;*/
  background: url(../../../assets/bj1.png) no-repeat;
  background-size:100% 100%;
}
.exit{
  width: 70%;
  height: .88rem;
  background-color: #fe5455;
  margin-left: 15%;
  border-radius: 30px;
  font-size: .34rem;
  color: #fff;
  line-height: .88rem;
  text-align: center;
  margin-top: 12vh
}
.regular-radio {
  display: none;
}
.regular-radio + label {
  width: 1.64rem;
  height: 1.64rem;
  background-size: 100%;
  margin-top: 45vh;
  -webkit-appearance: none;
  display: inline-block;
  position: relative;
}
.odd + label{
  left: 16vw;
  background-image: url(../../../assets/chicken_n.png);
}
.odd:checked + label{
  background-image: url(../../../assets/chicken_s.png);
  left: 16vw;
}
.even + label{
  left: 28vw;
  background-image: url(../../../assets/lotus_n.png);
}
.even:checked + label{
  background-image: url(../../../assets/lotus_s.png);
  left: 28vw;
}
.regular-radio:checked + label:after {}
.itemContent{
  width: 82%;
  margin-left: 9%;
  position: relative;
}
h1,h2,h3,h4,span,p{
  margin-bottom: 0;
  margin-top: 0;
  font-weight: normal;
}
.itemContent h1{
  font-size: .26rem;
  color: #999;
  float: left;
}
.itemContent h2{
  font-size: .26rem;
  color: #999;
  float: right;
}
.itemContent h3{
  clear: both;
  font-size: .26rem;
  color: #333;
  float: left;
  margin-top: .14rem;
}
.itemContent span{
  color: #fe5455;
}
.itemContent h4{
  font-size: .26rem;
  color: #333;
  margin-top: .14rem;
  float: right;
}

.itemContent h5{
  font-size: .26rem;
  color: #333;
  margin-top: .14rem;
  float: left;
  font-weight: normal;
}

.itemContent p{
  font-size: .3rem;
  color: #ff8452;
  float: right;
}
.backToOrder{
  width: 92%;
  height: .88rem;
  background-color: #fe5455;
  margin-left: 4%;
  border-radius: 30px;
  font-size: .34rem;
  color: #fff;
  line-height: .83rem;
  text-align: center;
  margin-top: 33%
}
</style>