<template>
<div class="container" v-title="'地址管理'">
  <!-- 将rootOrder 传入 -->
    <div class="itemContent" @click="chooseAddress()">
      <h1>{{ address.addressName }}</h1>
      <h2>{{ address.addressPhone }}</h2>
      <h3>{{ address.addressPositionTitle }}{{ address.addressPositionDetail }}</h3>
      <span class="el-icon-arrow-right"></span>
    </div>

    <div class="orderContent">
      <div class="top">
        <div class="time">{{ rootOrder.day}}&nbsp;&nbsp;{{ rootOrder.time }}</div>
      </div>

      <div class="middle goods">
      <!-- 从商品页传过来的参数 -->
        <div v-if="goodsDetail.goodsShowingImg != null">
          <img :src="goodsDetail.goodsShowingImg.sourceUrl">
        </div>
      <!-- 从订单页 -->
        <div v-if="goodsDetail.goods != '' && goodsDetail.goods != null">
          <img :src="goodsDetail.goods.goodsShowingImg.sourceUrl">
        </div>

        <h1>{{ rootOrder.orderDesc }}</h1>
        <!-- 从订单页 -->
          <h2 v-if="goodsDetail.goods != '' && goodsDetail.goods != null">¥{{ goodsDetail.goods.goodsPrice / 100}}</h2>
        <!-- 从商品页 -->
          <h2 v-if="goodsDetail.goodsShowingImg != null">{{ goodsDetail.goodsPrice / 100}}积分</h2>
        <span>×{{ rootOrder.orderNum }}</span>
        <div class="total">
          <p>共{{rootOrder.orderNum}}件商品 运费：¥{{ rootOrder.carriage/100}}</p>
        </div>
      </div>

      <div class="bottom">
        <p>合计：{{ rootOrder.totalPrice }}积分</p>
      </div>
  </div>
  <div class="fixedBottom" @click="submitTakeGoods()">确认提货</div>
  
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'address',
  data () {
    return {
      takegoodsRateOnLotterySuccess:0,
      rootOrder:{},
      goodsDetail:{},
      address:{},
      takeGoodsFromRootOrderVo:{
        addressId:''
      }
    }
  },
  created() {  
    let self = this
    //获取订单信息
    this.takegoodsRateOnLotterySuccess = sessionStorage.getItem('takegoodsRateOnLotterySuccess')
    this.rootOrder = JSON.parse(this.$route.params.rootOrder)   
    
    let day = this.rootOrder.createTime
    this.rootOrder.day = new Date(parseInt(day) * 1000).toLocaleDateString()
    this.rootOrder.time = new Date(parseInt(day) * 1000).toLocaleTimeString('chinese',{hour12:false})

    //获取商品信息
    this.goodsDetail = JSON.parse(this.$route.params.goodsDetail)

    if( typeof(this.$route.params.address) != "undefined"){
      this.address = JSON.parse(this.$route.params.address)      
    }else{
      this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId     
      axios.get('/bestlifeweb/address/getMemberAddressInfoList?memberId=' + self.memberId).then(function (res) {
        self.address = res.data.data[0]
      })
    }
    // 判断是否升级成功 ，提货的比例
    if(this.goodsDetail.lottery != null && this.goodsDetail.lottery.lotteryResult == 'success'){
      this.rootOrder.orderNum = this.rootOrder.orderNum * this.takegoodsRateOnLotterySuccess
    }
    //合计价格 总价+运费
    this.rootOrder.totalPrice = this.rootOrder.payPrice / 100  + this.rootOrder.carriage / 100
  },
  methods:{
    chooseAddress:function(){
      this.$router.replace({name: 'chooseAddressToPoint', params: {rootOrder: JSON.stringify(this.rootOrder),goodsDetail: JSON.stringify(this.goodsDetail)}})
    },
    submitTakeGoods: function(){
      let self = this
      this.takeGoodsFromRootOrderVo.addressId = this.address.addressId
      this.takeGoodsFromRootOrderVo.pointOrderId = JSON.parse(this.$route.params.rootOrder).rootOrderId
      axios({
        method: 'post',
        url: '/bestlifeweb/order/memberTakeGoodsFromPointOrder',
        headers: {'Content-Type': 'application/json'},
        data: self.takeGoodsFromRootOrderVo
      }).then(function (response) {
        alert('提货成功！')
        self.$router.replace({name: 'myOrder'})
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
  -webkit-overflow-scrolling : touch;
}

.itemContent{
  width: 100%;
  height: 1.4rem;
  background-color: #fff;
}
.itemContent h1{
  font-size: .32rem;
  color: #333;
  font-weight: normal;
  position: absolute;
  left: .24rem;
  margin-right: .24rem;
  margin-top: .24rem;
  margin-bottom: 0
}
.itemContent h2{
  width: 40%;
  font-size: .32rem;
  color: #333;
  font-weight: normal;
  margin-top: .24rem;
  margin-bottom: 0;
  position: absolute;
  left: 1.6rem;
}
.itemContent h3{
  width: 70%;
  height: .4rem;
  font-size: .28rem;
  color: #999;
  font-weight: normal;
  margin-left: .24rem;
  margin-top: .74rem;
  margin-bottom: 0;
  position: absolute;
  left: 0;
}
.itemContent span{
  color: #ccc;
  font-size: .32rem;
  float: right;
  margin-right: .24rem;
  line-height: 1.4rem;
}
.fixedBottom{
  width: 100%;
  height: .8rem;
  line-height: .8rem;
  position: fixed;
  bottom: 0;
  font-size: .26rem;
  color: #fff;
  text-align: center;
  background-color: #fe5454;
}
.orderContent{
  width: 100%;
  height: auto;
  margin-top: .24rem;
  background-color: #fff;
}
.top{
  width: 100%;
  height: .8rem;
  line-height: .8rem;
}
.time{
  font-size: .26rem;
  color: #999;
  float: left;
  margin-left: .24rem;
}
.staus{
  font-size: .26rem;
  color: #ff8452;
  float: right;
  margin-right: .24rem;
}
.middle{
  width: 100%;
  height: 1.8rem;
  background-color: #f3f3f3;
}
.middle img{
  width: 1.5rem;
  height: 1.5rem;
  margin-left: .24rem;
  margin-right: .2rem;
  margin-top: .15rem;
  float: left;
  position: relative;
}
.middle h1{
  height: .8rem;
  font-size: .28rem;
  color: #333;
  font-weight: 500;
  line-height: .4rem;
  padding-top: .2rem;
  margin-top: 0;
  margin-bottom: 0
}
.middle h2{
  font-size: .28rem;
  color: #333;
  font-weight: 500;
  line-height: .8rem;
  margin-top: 0;
  margin-bottom: 0;
  float:left;
}
.middle span{
  font-size: .26rem;
  color: #999;
  float: right;
  margin-top: .3rem;
  margin-right: .24rem;
}
.total{
  width: 100%;
  height: .64rem;
  clear: both;
  
  color: #333;
  line-height: .64rem;
  background-color: #fff;
  border-bottom: .01rem solid #efefef;
}
p{
  float: right;
  margin-top: 0;
  margin-right: .24rem;
  margin-bottom: 0;
  font-size: .26rem;
}
.bottom{
  width: 100%;
  height:.74rem;
  line-height: .74rem;
  clear: both;
}
.confirm{
  color: #fe5455;
  border-right: .01rem solid #efefef;
}
</style>
