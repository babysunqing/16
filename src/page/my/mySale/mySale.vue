<template>
<div class="container" v-title="'我的促销'">
	<mt-navbar class="navbar" v-model="selected">
    <mt-tab-item id="1"  >
      <p>猜鸡藕</p>
    </mt-tab-item>
    <mt-tab-item id="2">
      <p>拆红包</p>
    </mt-tab-item>
  </mt-navbar>

  
    <mt-tab-container v-model="selected" >
    <mt-tab-container-item id="1">
      <div class="itemContent" v-for="item in oddevenlist">
        <div class="item" style="width:100%;height:.3rem">
          <h1>订单编号：{{ item.lottery.lotteryId}}</h1><h1>...</h1>
          <h2>{{ item.rootOrder.day }} {{ item.rootOrder.time }}</h2>
        </div>
        <div class="item">
          <h3>是否猜中：
            <span style="font-size:.3rem" v-if="item.lottery.lotteryResult == 'success'">是</span>
            <span style="font-size:.3rem" v-if="item.lottery.lotteryResult == 'fail'">否</span>
            <span style="font-size:.3rem" v-if="item.lottery.lotteryResult == 'init'">开奖中</span>
          </h3>

          <h4 v-if="item.lottery.lotteryOddEvenChoose == 'even' ">鸡藕：<span>藕</span></h4>
          <h4 v-if="item.lottery.lotteryOddEvenChoose == 'odd' ">鸡藕：<span>鸡</span></h4>

        </div> 
        <div class="item" style="padding-bottom:.3rem" v-if="item.guessOddEven != null">
          <h3>期数：<span style="font-size:.3rem;color:#ff8452">{{ item.guessOddEven.oddEvenPeriod }}</span></h3>
          <h3>期数值：<p style="font-size:.3rem">{{ item.guessOddEven.oddEvenNum }}</p></h3>
        </div>
      </div>
    </mt-tab-container-item>
  
  
  
    <mt-tab-container-item id="2"  >
      <div class="itemContent" v-for="item in redpacketList">
        <div class="item" style="width:100%;height:.3rem">
          <h1>订单编号：{{item.lottery.lotteryId}}</h1><h1>...</h1>
          <h2>{{ item.rootOrder.day }} {{ item.rootOrder.time }}</h2>
        </div>       
        <div class="item">
          <h3>是否猜中：
            <span style="font-size:.3rem" v-if="item.lottery.lotteryResult == 'success'">是</span>
            <span style="font-size:.3rem" v-if="item.lottery.lotteryResult == 'fail'">否</span>

          </h3>
        </div>         
      </div>
    </mt-tab-container-item>

  </mt-tab-container>

</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'mySale',
  data () {
    return {
      selected:'1',
      list:[],
      oddevenlist:[],
      redpacketList:[]
    }
  },
  created(){
    let self = this
    this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
    axios.get('/bestlifeweb/order/getMemberOrderInfoList?memberId=' +self.memberId).then(function (res) {
      self.list = res.data.data
      if(self.list.length > 0){
        for(var i = 0; i < self.list.length; i++){
            if(self.list[i].lottery != null){
            self.list[i].lottery.lotteryId = self.list[i].lottery.lotteryId.substring(0,7) 
            var day = self.list[i].rootOrder.createTime
            self.list[i].rootOrder.day = new Date(parseInt(day) * 1000).toLocaleDateString()
            self.list[i].rootOrder.time = new Date(parseInt(day) * 1000).toLocaleTimeString('chinese',{hour12:false})
            if(self.list[i].lottery != null){
              if(self.list[i].lottery.lotteryType == 'oddeven'){
                self.oddevenlist.push(self.list[i])         
              }else{
                self.redpacketList.push(self.list[i])
              }
            }
          } 
        }
      }
    })
  },
  methods:{
  }  
}
</script> 

<style scoped>
.container{
	width: 100%;
	height: 100%;
	overflow: auto;
	-webkit-overflow-scrolling : touch;
}
.item{
  width: 100%;
  height: .6rem;
}
.navbar{
  height: .78rem;
}
p{
  font-size:.3rem;
  margin-top: -.1rem;
  margin-bottom: 0;
}
.itemContent{
  padding: .4rem .24rem;
  position: relative;
  border-bottom: .01rem solid #efefef
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
.itemContent p{
  font-size: .3rem;
  color: #ff8452;
  float: right;
}
</style>