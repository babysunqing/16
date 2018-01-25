<template>
<div class="container" v-title="'积分订单'">
  <div class="empty" v-if="isShow">
    暂无订单
  </div>

    <div class="orderContent" v-for="item in pointOrderList" >

      <!-- 头部-->
      <div class="top">
        <div class="time">{{ item.pointOrder.day}}&nbsp;&nbsp;{{ item.pointOrder.time }}</div>
        <div class="staus" v-if="item.takeGoods == null">正常</div>
        <div class="staus" v-if="item.takeGoods != null">已提货</div>
      </div>

      <!--商品信息 -->
        <div class="middle goods" @click="linkToGoodsDetail(item)">
          <img :src="item.goods.goodsShowingImg.sourceUrl">
          <h1>{{ item.pointOrder.pointOrderDesc }}</h1>
          <h2>{{ item.pointOrder.pointPayPoint / item.pointOrder.pointOrderNum }}积分</h2>
          <span>×{{ item.pointOrder.pointOrderNum}}</span>
          <div class="total">
            <p>共{{ item.pointOrder.pointOrderNum }}件 总计：{{ item.pointOrder.pointPayPoint }}积分</p>
          </div>
        </div>
      <!-- 底部 -->
      <div class="bottom">
        <!-- 提货 -->
        <div class="takeGoods" v-if="item.takeGoods == null"  @click="takeGoods(item)">提货</div>
        <!-- 物流信息 -->
        <div class="takeGoods" v-if="item.takeGoods != null" @click="alertLogistics(item)">物流信息</div>
        <!-- 再来一单 -->
        <router-link to="/index">
          <div class="sale" v-if="item.takeGoods != null">再来一单</div>
        </router-link>
      </div>
    </div>

    <!-- 弹出层集合 -->
    <div>
      <!-- 提货 -->
        <mt-popup class="popContent" v-model="popupTakeGoods" popup-transition="popup-fade">
            <div>
              <h1>提货</h1>
              <p>您还需要支付{{ pointOrder.carriage / 100}}元运费，确认提货?</p>
              <router-link class="deleteline" :to="{name: 'takeGoods', params: {pointOrder: JSON.stringify(pointOrder),goodsDetail: JSON.stringify(goodsDetail)}}">
                <div class="confirm" @click="submitTakeGoods()">确定</div>
              </router-link>
              <div class="cancel" @click="cancel()">取消</div>
            </div>
        </mt-popup>

      <!-- 物流信息 -->
        <mt-popup class="popContent" v-model="popupLogistics" popup-transition="popup-fade">
          <div>
            <h1>物流信息</h1>
            <p v-if="takeGoods.expressId == ''">
              暂无物流信息
            </p>
            <p v-if="takeGoods.expressId != ''">
              快递名称：{{takeGoods.expressName}}<br>
              快递单号：{{takeGoods.expressId}}              
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
      item:{
        pointOrder:{}
      },
      takeGoodsItem:{},
      order:{},
      goodsDetail:{},
      pointOrder:{},
      popupTakeGoods: false,
      popupLogistics:false,
      isShow: false,
      status: 'takegoods',
      pointOrderList:[]
    }
  },
  created () {
    let self = this
    this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
    axios.get('/bestlifeweb/order/getMemberPointOrderInfoList?memberId=' + self.memberId)
    .then(function (res) {
        self.pointOrderList = res.data.data
        if(self.pointOrderList.length <= 0){
          self.isShow = true
        }
        if(self.pointOrderList.length > 0){
          for(let i = 0; i < self.pointOrderList.length; i++){
            self.pointOrderList[i].goods.goodsShowingImg = eval('(' + self.pointOrderList[i].goods.goodsShowingImg + ')')
            let day = self.pointOrderList[i].pointOrder.createTime
            self.pointOrderList[i].pointOrder.day = new Date(parseInt(day) * 1000).toLocaleDateString()
            self.pointOrderList[i].pointOrder.time = new Date(parseInt(day) * 1000).toLocaleTimeString('chinese',{hour12:false})
          }
        }
    })
    .catch(function(err){
      alert(err.message)
    })
  },
  methods:{
    takeGoods:function(item){ //弹出提示 是否提货
      // debugger
      this.popupTakeGoods = true
      this.pointOrder = item.pointOrder
      this.goodsDetail = item     
    },
    alertLogistics:function(item){ //弹出提示 物流信息
      this.popupLogistics = true
      this.takeGoods = item.takeGoods
    },
    submitTakeGoods: function(){ //确认提货
      this.popupTakeGoods = false
    },
    cancel: function () {
      this.popupTakeGoods = false
      this.popupLogistics = false
    },
    linkToGoodsDetail:function(item){
      if(item.goods.goodsStatus == 1){
        alert('商品已下架')
      }else if(item.goods.goodsStatus == 0){
        this.$router.push({name: 'exchangeDetail', params: {id:item.goods.goodsId}})
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
  font-size: .3rem;
  color: #666;
  text-align: center;
  margin-top: .3rem;
}
.Logistics{
  width: 100%;
  text-align: center;
  margin-left: 0
}
</style>


