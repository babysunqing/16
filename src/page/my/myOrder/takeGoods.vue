<template>
<div class="container" v-title="'地址管理'">
  <!-- 将rootOrder 传入 -->
  <div v-if="address != '' && address != undefined">
    <div class="itemContent" @click="chooseAddress()">
      <h1>{{ address.addressName }}</h1>
      <h2>{{ address.addressPhone }}</h2>
      <h3>{{ address.addressPositionTitle }}{{ address.addressPositionDetail }}</h3>
      <span class="el-icon-arrow-right"></span>
    </div>
  </div>
  
  

  <div class="itemContent" @click="chooseAddress()" v-if="address == '' || address == undefined">
    <h3 style="position:absolute;top:-.2rem">请添加收货地址</h3>
    <span class="el-icon-arrow-right"></span>
  </div>

  <div class="orderContent">
    <div class="top">
      <div class="time" v-if="rootOrder.day">{{ rootOrder.day}}&nbsp;&nbsp;{{ rootOrder.time }}</div>
      <div class="time" v-if="pointOrder.day">{{ pointOrder.day}}&nbsp;&nbsp;{{ pointOrder.time }}</div>
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

      <!-- 商品描述 -->
      <h1 v-if="rootOrder.orderDesc">{{ rootOrder.orderDesc }}</h1>
      <h1 v-if="pointOrder.pointOrderDesc">{{ pointOrder.pointOrderDesc }}</h1>
      
      <!-- 商品价格 -->
      <!-- 订单页 -->
      <h2 v-if="pointOrder.pointPayPoint">{{ pointOrder.pointPayPoint / pointOrder.pointOrderNum}}积分</h2>

      <h2 v-else-if="goodsDetail.goodsPrice">¥{{ goodsDetail.goodsPrice / 100 }}</h2>
      <h2 v-else-if="goodsDetail.goods">¥{{ goodsDetail.goods.goodsPrice / 100 }}</h2>

      <!-- 商品个数 -->
      <span v-if="rootOrder.orderNum">×{{ rootOrder.orderNum }}</span>
      <span v-if="pointOrder.pointOrderNum">×{{ pointOrder.pointOrderNum }}</span>

      <!-- 合计价格 -->
      <div class="total">
        <p v-if="pointOrder.pointOrderNum">共{{pointOrder.pointOrderNum}}件商品 运费：¥{{ pointOrder.carriage/100}}</p>
        <p v-else-if="rootOrder.computeCarriage">共{{rootOrder.orderNum}}件商品 运费：¥{{ rootOrder.computeCarriage / 100}}</p>
        <p v-else>共{{rootOrder.orderNum}}件商品 运费：¥{{ rootOrder.carriage / 100}}</p>
      </div>
    </div>

    <div class="bottom">
      <p v-if="rootOrder.totalPrice">合计：¥{{ rootOrder.totalPrice }}</p>
      <p v-if="pointOrder.pointPayPoint">合计：{{ pointOrder.pointPayPoint}}积分</p>
    </div>
  </div>
  <mt-popup class="popContent" v-model="popupTakeGoods" popup-transition="popup-fade">
    <div>
      <h1>提货</h1>
      <p>您还需要支付{{ pointOrder.carriage / 100}}元运费，确认提货?</p>
      <div class="confirm" @click="doTakeGoods()">确定</div>
      <div class="cancel" @click="cancel()">取消</div>
    </div>
  </mt-popup>
  <div class="fixedBottom" @click="submitTakeGoods(pointOrder)">确认提货</div>
  
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'address',
  data () {
    return {
      popupTakeGoods: false,
      rootOrder:{},
      goodsDetail:{},
      pointOrder:{},
      address:{},
      takeGoodsFromRootOrderVo:{
        addressId:''
      },
      takeGoodsFromPointOrderVo:{
        addressId: '',
        pointOrderId: ''
      }
    }
  },
  created() {  
    let self = this
    //获取提货比例
    debugger
    this.takegoodsRateOnLotterySuccess = sessionStorage.getItem('takegoodsRateOnLotterySuccess')
    //获取商品信息
    this.goodsDetail = JSON.parse(this.$route.params.goodsDetail)

    //获取传过来的积分订单信息
    if(this.$route.params.pointOrder != undefined){
      this.pointOrder = JSON.parse(this.$route.params.pointOrder)
      let day = this.pointOrder.createTime
      this.pointOrder.day = new Date(parseInt(day) * 1000).toLocaleDateString()
      this.pointOrder.time = new Date(parseInt(day) * 1000).toLocaleTimeString('chinese',{hour12:false})
    }

    //获取传过来的购物订单信息
    if(this.$route.params.rootOrder != undefined){
      this.rootOrder = JSON.parse(this.$route.params.rootOrder)
      //转换成具体时间
      let day = this.rootOrder.createTime
      this.rootOrder.day = new Date(parseInt(day) * 1000).toLocaleDateString()
      this.rootOrder.time = new Date(parseInt(day) * 1000).toLocaleTimeString('chinese',{hour12:false})
      this.rootOrder.totalPrice = this.rootOrder.payPrice / 100  + this.rootOrder.carriage / 100

      // 若升级成功，提货的比例要乘以2
      if(this.goodsDetail.lottery != null && this.goodsDetail.lottery.lotteryResult == 'success'){
        this.rootOrder.orderNum = this.rootOrder.orderNum * this.takegoodsRateOnLotterySuccess
      }
    }
    
    //判断地址是从路由传过来的，还是直接获取的
    // debugger
    if(typeof(this.$route.params.address) != "undefined"){
      this.address = JSON.parse(this.$route.params.address)      
    }else{
      this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId      
      axios.get('/bestlifeweb/address/getMemberAddressInfoList?memberId=' + self.memberId).then(function (res) {
        self.address = res.data.data[0]
      })
    }
  },
  methods:{
    cancel:function() {
      this.popupTakeGoods = false
    },
    chooseAddress:function(){
      if(this.$route.params.rootOrder == undefined){
        this.$router.replace({name: 'chooseAddress', params: {pointOrder: JSON.stringify(this.pointOrder),goodsDetail: JSON.stringify(this.goodsDetail)}})
      }
      if(this.$route.params.pointOrder == undefined){
        this.$router.replace({name: 'chooseAddress', params: {rootOrder: JSON.stringify(this.rootOrder),goodsDetail: JSON.stringify(this.goodsDetail)}})
      }
    },
    doTakeGoods: function(){
      let self = this
      this.popupTakeGoods = false
      this.takeGoodsFromPointOrderVo.pointOrderId = JSON.parse(this.$route.params.pointOrder).pointOrderId
      this.takeGoodsFromPointOrderVo.addressId = this.address.addressId
      
      axios({
        method: 'post',
        url: '/bestlifeweb/order/memberTakeGoodsFromPointOrder',
        headers: {'Content-Type': 'application/json'},
        data: self.takeGoodsFromPointOrderVo
      }).then(function (res) {
        alert('提货成功！')
        self.$router.replace({name: 'pointOrder'})
      })
    },
    submitTakeGoods: function(){
      let self = this
      
      // debugger
      if(this.$route.params.pointOrder != undefined ){
        if(this.address == undefined || this.address == ""){
          alert("请添加收货地址")
          return
        }
        this.popupTakeGoods = true
      }
      if(this.$route.params.rootOrder != undefined){
        //从升级订单提货
        if(this.address == undefined || this.address == ""){
          alert("请添加收货地址")
          return
        }
        this.takeGoodsFromRootOrderVo.addressId = this.address.addressId
        if(JSON.parse(this.$route.params.goodsDetail).lottery != null){
          this.takeGoodsFromRootOrderVo.lotteryId = JSON.parse(this.$route.params.goodsDetail).lottery.lotteryId
          axios({
            method: 'post',
            url: '/bestlifeweb/order/memberTakeGoodsFromLottery',
            headers: {'Content-Type': 'application/json'},
            data: self.takeGoodsFromRootOrderVo
          }).then(function (response) {
            alert('提货成功！')
            self.$router.replace({name: 'myOrder'})
          })
        }else{
          //从购物订单提货
          this.takeGoodsFromRootOrderVo.rootOrderId = JSON.parse(this.$route.params.rootOrder).rootOrderId
          axios({
            method: 'post',
            url: '/bestlifeweb/order/memberTakeGoodsFromRootOrder',
            headers: {'Content-Type': 'application/json'},
            data: self.takeGoodsFromRootOrderVo
          }).then(function (response) {
            alert('提货成功！')
            self.$router.replace({name: 'myOrder'})
          })
        }
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
.popContent{
  width: 5.4rem;
  background-color: #fff;
  border-radius: .26rem;
  text-align: center;
}
.popContent h1{
  margin-top: .42rem;
  margin-bottom: 0;
  font-size: .34rem;
  color: #333;
}
.popContent p{
  width: 90%;
  margin-left: 5%;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: .2rem;
  padding-bottom: .3rem;
  font-size: .28rem;
  color: #666;
  border-bottom: .01rem solid #efefef;
}
.popContent .confirm,.cancel{
  float: left;
  width:45%;
  height: .9rem;
  margin-left: 3.5%;
  line-height: .9rem;
  font-size: .26rem;
}
</style>