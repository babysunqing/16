<template>
<div class="container" v-title="'我的订单'">
  <div class="el-icon-loading loadingIcon" v-if="loadingIcon"></div>

  <div class="empty" v-if="isShow">
    暂无订单
  </div>
  <div class="mui-table-view" 
      v-infinite-scroll="loadMore" 
      infinite-scroll-disabled="queryLoading" 
      infinite-scroll-distance="10" 
      infinite-scroll-immediate-check="false">
      
      <div class="orderContent" v-for="item in orderList">

        <!-- 头部-->
        <div class="top">
          <div class="time">{{ item.rootOrder.day}}&nbsp;&nbsp;{{ item.rootOrder.time }}</div>
          <div class="staus" v-if="item.rootOrder.orderStatus == 'init'">正常</div>
          <div class="staus" v-if="item.rootOrder.orderStatus == 'takegoods' || item.takeGoods != null">已提货</div>
          <div class="staus" v-if="item.convertToPoint == null && item.refund == null && item.takeGoods == null && item.rootOrder.orderStatus == 'lottery' && item.lottery.lotteryResult == 'init'">升级中</div>
          <div class="staus" v-if="item.convertToPoint == null && item.refund == null && item.takeGoods == null && item.rootOrder.orderStatus == 'lottery' && item.lottery.lotteryResult == 'success'">升级成功</div>
          <div class="staus" v-if="item.convertToPoint == null && item.refund == null && item.takeGoods == null && item.rootOrder.orderStatus == 'lottery' && item.lottery.lotteryResult == 'fail'">升级失败</div>
          <div class="staus" v-if="item.refund != null &&  item.refund.refundStatus == 'init'">退货中</div>
          <div class="staus" v-if="item.refund != null &&  item.refund.refundStatus == 'reject'">退货失败</div>
          <div class="staus" v-if="item.refund != null &&  item.refund.refundStatus == 'pass'">退货成功</div>
          <div class="staus" v-if="item.convertToPoint != null">已兑换积分</div>
        </div>

        <!--商品信息 -->
          <div class="middle goods" @click="linkToGoodsDetail(item)">
            <img :src="item.goods.goodsShowingImg.sourceUrl">
            <h1>{{ item.rootOrder.orderDesc }}</h1>
            <h2>¥{{ item.rootOrder.payPrice / item.rootOrder.orderNum / 100 }}</h2>
            
            <span v-if="item.lottery != null && item.lottery.lotteryResult == 'success'">×{{ item.rootOrder.orderNum * takegoodsRateOnLotterySuccess}}</span>
            <span v-else>×{{ item.rootOrder.orderNum}}</span>

            <div class="total">
            <!-- 升级成功的订单 -->
              <p v-if="item.lottery != null && item.lottery.lotteryResult == 'success'">
                共{{ item.rootOrder.orderNum * takegoodsRateOnLotterySuccess }}件 
                订单金额：¥{{ item.rootOrder.payPrice/100 * refundRateOnLotterySuccess / 100}}
              </p>
            <!--  普通订单-->
              <p v-else>
                共{{ item.rootOrder.orderNum }}件 
                订单金额：¥{{ item.rootOrder.payPrice / 100}}
              </p>
            </div>
          </div>
        <!-- 底部 -->
        <div class="bottom">
          <!-- 兑换积分 -->
          <div class="sale" @click="alertPointPop(item)" v-if="item.rootOrder.orderStatus == 'lottery' && item.lottery.lotteryResult == 'success' && item.refund == null && item.takeGoods == null && item.convertToPoint == null">兑换积分</div>
          <div class="sale" @click="alertPointPop(item)" v-if="item.rootOrder.orderStatus == 'lottery' && item.lottery.lotteryResult == 'fail' && item.refund == null && item.takeGoods == null && item.convertToPoint == null">兑换积分</div>
          <!-- 促销  -->
          <div class="sale" @click="alertSalePop(item)" v-if="item.rootOrder.orderStatus == 'init'">促销</div>
          <!-- 提货 -->
          <div class="takeGoods" @click="takeGoods(item)" v-if="item.rootOrder.orderStatus == 'init'">提货</div>
          <div class="takeGoods" @click="takeGoods(item)" v-if="item.rootOrder.orderStatus == 'lottery' && item.lottery.lotteryResult == 'success' && item.refund == null && item.takeGoods == null && item.convertToPoint == null">提货</div>
          <div class="takeGoods" @click="takeGoods(item)" v-if="item.rootOrder.orderStatus == 'lottery' && item.lottery.lotteryResult == 'fail' && item.refund == null && item.takeGoods == null && item.convertToPoint == null">提货</div>

          <!-- 退款 -->
          <div class="takeGoods" v-if="item.rootOrder.orderStatus == 'lottery' && item.lottery.lotteryResult == 'success' && item.refund == null && item.takeGoods == null && item.convertToPoint == null " @click="alertRefund(item)">退货</div>

          <!-- 物流信息 -->
          <div class="takeGoods" v-if="item.rootOrder.orderStatus == 'takegoods'" @click="alertLogistics(item)">物流信息</div>
          <div class="takeGoods" v-if="item.rootOrder.orderStatus == 'lottery' && item.takeGoods != null" @click="alertLogistics(item)">物流信息</div>

          <!-- 再来一单 -->
          <router-link to="/index">
            <div class="sale" v-if="item.rootOrder.orderStatus == 'takegoods'">再来一单</div>
            <div class="sale" v-if="item.rootOrder.orderStatus == 'lottery' && item.lottery.lotteryResult == 'init'">再来一单</div>
            <div class="sale" v-if="item.rootOrder.orderStatus == 'lottery' && item.lottery.lotteryResult == 'success' && item.refund != null">再来一单</div>
            <div class="sale" v-if="item.rootOrder.orderStatus == 'lottery' && item.takeGoods != null">再来一单</div>
            <div class="sale" v-if="item.rootOrder.orderStatus == 'lottery' && item.convertToPoint != null">再来一单</div>
          </router-link>

        </div>
      </div>
      
    
      <div class="bottomIcon" v-show="allLoaded">
        <span>已全部加载</span>
      </div>

      <div class="bottomIcon" v-show="queryLoading">
        <span>加载中....</span>
      </div>
  </div>
  

  <!-- 弹出层集合 -->
  <div>
     <!-- 兑换积分 -->
        <mt-popup class="popContent" v-model="popupPoint" popup-transition="popup-fade">
          <div>
            <h1>兑换积分</h1>
            <p v-if="item.lottery != null && item.lottery.lotteryResult == 'fail'">
            可兑换{{ item.rootOrder.payPrice * pointMoneyExchangeRate }}积分，是否确定兑换，兑换成功在我的页面查看?
            </p>

            <p v-if="item.lottery != null && item.lottery.lotteryResult == 'success'">
            可兑换{{ item.rootOrder.payPrice * refundRateOnLotterySuccess  * pointMoneyExchangeRate }}积分，是否确定兑换，兑换成功在我的页面查看?
            </p>
            <div class="confirm" @click="submitPoint()">确定</div>
            <div class="cancel" @click="cancel()">取消</div>
          </div>
        </mt-popup>

         <!-- 促销  -->
        <mt-popup class="popContent" v-model="popupSale" popup-transition="popup-fade">
          <div>
            <h1>促销</h1>
            <p>是否继续支付{{ lotteryFee }}元参与促销?</p>
            <div class="confirm" @click="submitSale()">确定</div>
            <div class="cancel" @click="cancel()">取消</div>
          </div>
        </mt-popup>

        <!-- 升级  -->
        <mt-popup class="popContent" v-model="popupUpdate" popup-transition="popup-fade">
          <div>
            <h1>选择升级方式</h1>
              <div class="guessJO" @click="guessJO()">猜鸡藕</div>
              <div class="openRedPacket" @click="openRedPacket()">拆红包</div>
          </div>
        </mt-popup>

      <!-- 提货 -->
      <mt-popup class="popContent" v-model="popupTakeGoods" popup-transition="popup-fade">
          <div>
            <h1>提货</h1>
            <p>您还需要支付{{ rootOrder.computeCarriage / 100}}元运费，确认提货?</p>
            <router-link class="deleteline" :to="{name: 'takeGoods', params: {rootOrder: JSON.stringify(rootOrder),goodsDetail: JSON.stringify(goodsDetail)}}">
              <div class="confirm" @click="submitTakeGoods()">确定</div>
            </router-link>
            <div class="cancel" @click="cancel()">取消</div>
          </div>
      </mt-popup>

      <!-- 退款  -->
      <mt-popup class="popContent" v-model="popupRefund" popup-transition="popup-fade">
          <div>
            <h1>退货</h1>
            <p>您可退{{ rootOrder.payPrice * refundRateOnLotterySuccess / 100 / 100 }}元，确认退货?</p>
            <div class="confirm" @click="submitRefund()">确定</div>
            <div class="cancel" @click="cancel()">取消</div>
          </div>
      </mt-popup>
      
      <!-- 物流信息 -->
        <mt-popup class="popContent" v-model="popupLogistics" popup-transition="popup-fade">
          <div>
            <h1>物流信息</h1>
            <p v-if="takeGoods.expressId == ''">暂无物流信息</p>
            <p v-if="takeGoods.expressId != ''">
              快递名称:{{takeGoods.expressName}}<br>
              快递单号:{{takeGoods.expressId}}
            </p>
            <div class="cancel Logistics" @click="cancel()">关闭</div>
          </div>
        </mt-popup>  
  </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'pointOrder',
  data () {
    return {
      loadingIcon:true,
      item:{},
      lotteryFee:'',
      order:{},
      goodsDetail:{},
      refund:{},
      rootOrder:{}, // 用户选择的商品
      isShow: false,
      status: 'takegoods',
      orderList:[],
      //初始化无限加载相关参数
      queryLoading: false, //加载中标志
      allLoaded: false, //判断是否到达最大页数
      totalNum: 0, // 总数目
      totalPages: 0, // 总页数
      pageSize: 0, //每页显示数
      pageNum: 1, //当前页数
      // 初始化弹出层的默认值
      popupRefund:false, //退款
      popupPoint:false,
      popupSale:false,
      popupTakeGoods: false,
      popupLogistics:false,
      popupUpdate: false,
    }
  },
  created () {
    this.refundRateOnLotterySuccess = sessionStorage.getItem('refundRateOnLotterySuccess')
    this.pointMoneyExchangeRate = sessionStorage.getItem('pointMoneyExchangeRate')
    this.takegoodsRateOnLotterySuccess = sessionStorage.getItem('takegoodsRateOnLotterySuccess')

    if(this.refundRateOnLotterySuccess == 0 || this.pointMoneyExchangeRate == 0 || this.takegoodsRateOnLotterySuccess == 0){
      let self = this
      this.userId = JSON.parse(sessionStorage.getItem('myInfo')).userId
      axios.get('/bestlifeweb/user/getUserInfo?userId=' + self.userId).then(function (res) {
          var dataList = res.data.data
          self.takegoodsRateOnLotterySuccess = dataList[0].takegoodsRateOnLotterySuccess
          self.refundRateOnLotterySuccess =  dataList[0].refundRateOnLotterySuccess
          self.pointMoneyExchangeRate =  dataList[0].pointMoneyExchangeRate
      }).catch(function(err){
          alert(err)
      })
    }

    let self = this
    this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
    axios.get('/bestlifeweb/order/getMemberOrderInfoList?memberId=' + self.memberId + '&pageNum=' + this.pageNum)
    .then(function (res) {
        self.loadingIcon = false
        //记录返回的数据
        self.setPage(res.data.data)
        //第一页数据的数据加载
        self.orderList = res.data.data.list
        // 把时间戳转换、图片数组构建
        self.setTime(self.orderList)
        // 如果返回值为空数组 显示暂无订单
        if(self.orderList.length <= 0){
          self.isShow = true
        }
    })
    .catch(function(err){
      alert(err.message)
    })
  },
  computed: {
   params() {
    return{
     pageSize: this.pageSize //每页显示数
     }
   }
  },
  methods:{
    // 构建build参数
   setPage(data) {
     // this.pageNum  = data.pageNum
     this.pageSize = data.size
     this.totalNum = data.total
     this.totalPages = data.pages
   },
   // 把时间戳转换、图片数组构建
   setTime(orderList) {
     if(orderList.length > 0){
        for(var i = 0; i < orderList.length; i++){
          orderList[i].goods.goodsShowingImg = eval('(' + orderList[i].goods.goodsShowingImg + ')')
          var day = orderList[i].rootOrder.createTime
          orderList[i].rootOrder.day = new Date(parseInt(day) * 1000).toLocaleDateString()
          orderList[i].rootOrder.time = new Date(parseInt(day) * 1000).toLocaleTimeString('chinese',{hour12:false})
        }
     }
   },
    // 判断是否到达最大页数
    // 返回true 说明已经最大页数
    // 返回false 说明还未到达
    isAllLoaded() {
      // 如果当前页数到达最大页数
      if(this.pageNum >= this.totalPages){
        this.allLoaded = true
        this.pageNum = this.totalPages
        return false
      }
      else{
        return true
      }
    },
    //下拉底部加载下一页数据
    loadMore() {
      // 显示查询加载图标
      if(this.isAllLoaded() ){
        this.queryLoading = true
        this.pageNum ++
        let self = this
        this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
        axios.get('/bestlifeweb/order/getMemberOrderInfoList?memberId=' + self.memberId + '&pageNum=' + this.pageNum)
        .then((res) => {
          self.queryLoading = false
          // res.data.data.list 设置日期
          self.setPage(res.data.data)
          self.setTime(res.data.data.list)
          self.orderList = self.orderList.concat(res.data.data.list)       
        }).catch(function(err){
          alert(err)
        })
      }
    },
    alertPointPop:function(item){ //弹出提示 是否兑换积分
      this.popupPoint = true
      this.item = item
    },
    takeGoods:function(item){ //弹出提示 是否提货
      if(item.lottery != null && item.lottery.lotteryResult == 'success'){
        item.rootOrder.computeCarriage = item.goods.goodsCarriageStartPrice + ( item.rootOrder.orderNum * this.takegoodsRateOnLotterySuccess - 1 ) * item.goods.goodsCarriageAddPrice
      }else{
        item.rootOrder.computeCarriage = item.rootOrder.carriage
      }
      this.rootOrder = item.rootOrder
      this.goodsDetail = item
      this.popupTakeGoods = true
      // debugger
    },
    alertSalePop:function(item){ //弹出提示 是否参与促销
      this.rootOrder = item.rootOrder
      var lotteryRate = sessionStorage.getItem('lotteryRate')/100
      this.lotteryFee = (this.rootOrder.payPrice / 100 * this.rootOrder.orderNum * lotteryRate).toFixed(2)
      this.popupSale = true
    },
    alertLogistics:function(item){ //弹出提示 物流信息
      this.popupLogistics = true
      this.takeGoods = item.takeGoods
    },
    alertRefund:function(item){
      if(this.popupRefund == false){
        this.popupRefund = true
        this.rootOrder = item.rootOrder
        this.goodsDetail = item
      }
    },
    submitPoint: function(){ //确认兑换积分
      this.popupPoint = false
      let self = this
      this.lotteryId = this.item.lottery.lotteryId
      axios.get('/bestlifeweb/order/memberConvertToPointFromLottery?lotteryId=' + self.lotteryId)
      .then(function (res) {
        alert('兑换成功！')
        window.location.reload()
      }).catch(function(err){
        alert(err)        
      })
    },
    submitTakeGoods: function(){ //确认提货
      this.popupTakeGoods = false
    },
    submitSale:function(){ //确认参与促销
      this.popupSale = false
      this.popupUpdate = true
    },
    cancel: function () {
      this.popupTakeGoods = false
      this.popupSale = false
      this.popupPoint = false
      this.popupRefund = false
      this.popupLogistics = false
    },
    linkToGoodsDetail:function(item){
      // debugger
      if(item.lottery != null){
        if(item.lottery.lotteryType == 'oddeven'){
          this.$router.push({name: 'joOrder', params: {item:JSON.stringify(item)}})
        }else{
          this.$router.push({name: 'redPacketOrder', params: {item:JSON.stringify(item)}})
        }
      }else if(item.goods.goodsStatus == 1){
        alert('商品已下架')
      }else if(item.goods.goodsStatus == 0){
        this.$router.push({name: 'goodsDetail', params: {id:item.goods.goodsId}})
      }
    },
    openRedPacket:function(){
      this.$router.replace({name: 'openRedPacket', params: {rootOrder: JSON.stringify(this.rootOrder)}})
    },
    guessJO:function(){
      this.$router.replace({name: 'guessJO', params: {rootOrder: JSON.stringify(this.rootOrder)}})
    },
    submitRefund:function(){
      if(this.popupRefund == true){
        this.popupRefund = false
        let self = this
        this.lotteryId = this.goodsDetail.lottery.lotteryId
        axios.get('/bestlifeweb/order/memberRefundFromLottery?lotteryId=' + self.lotteryId).then(function (res) {
          alert('退货申请已提交')
          window.location.reload()
        }).catch(function(err){
          alert(err)        
        })
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
.loadingIcon{
  color: #999;
  text-align: center;
  margin-top: 40vh;
  margin-left:43vw
}
.deleteline{
  text-decoration: none;
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
  font-size: .26rem;
  color: #333;
  line-height: .64rem;
  background-color: #fff;
  border-bottom: .01rem solid #efefef;
}
.total p{
  float: right;
  margin-top: 0;
  margin-right: .24rem;
  margin-bottom: 0
}
.bottom{
  width: 100%;
  height: 1.08rem;
  clear: both;
}
.bottom .takeGoods{
  width: 1.3rem;
  height: .6rem;
  float: right;
  margin-top: .24rem;
  margin-right: .24rem;
  border: .01rem solid #efefef;
  border-radius: .1rem;
  font-size: .26rem;
  color: #666;
  text-align: center;
  line-height: .6rem;
}
.bottom .sale{
  width: 1.3rem;
  height: .6rem;
  float: right;
  margin-top: .24rem;
  margin-right: .2rem;
  border: .01rem solid #fe5455;
  border-radius: .1rem;
  font-size: .26rem;
  color: #fe5455;
  text-align: center;
  line-height: .6rem;
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
.confirm{
  color: #fe5455;
  border-right: .01rem solid #efefef;
}
.guessJO,.openRedPacket{
  width: 88%;
  height: .78rem;
  margin-left: 6%;
  border-radius: .5rem;
  line-height: .78rem;
  margin-top: .32rem;
  font-size: .32rem;
  color: #fff;
}
.guessJO{
  background-color: #fe5455;
}
.openRedPacket{
  margin-bottom: .48rem;
  background-color: #ff8452;
}
.empty{
  font-size: .32rem;
  color: #666;
  text-align: center;
  margin-top: .3rem;
}
.Logistics{
  width: 100%;
  text-align: center;
  margin-left: 0
}
.bottomIcon{
  height: 1.12rem;
  margin-left: .24rem;
  margin-right: .24rem;
  text-align: center;
  font-size: .24rem;
  line-height: 1.12rem;
}
.bottomIcon span{
  color: #999;
}
</style>