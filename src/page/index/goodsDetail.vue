<template>
<div class="container" v-title="'商品详情'">
<div class="main">
		<!-- 商品展示图 -->
		<div class="top">
			<div class="banner">
				<mt-swipe>
				  <mt-swipe-item @change="handleChange" v-for="(item,index) in goodsDetail.goodsBannerImgs" :key="index">
				  	<img :src="item.sourceUrl">
				  </mt-swipe-item>
				</mt-swipe>
			</div>
			<h1>{{ goodsDetail.goodsName }}</h1>
			<h2><span>¥ </span>{{ goodsDetail.goodsPrice / 100 }}</h2>
			<h3>运费:{{ goodsDetail.goodsCarriageStartPrice / 100}}元(运费每件{{ goodsDetail.goodsCarriageStartPrice / 100}}元，此后每件依次加{{ goodsDetail.goodsCarriageAddPrice / 100}}元)</h3>
		</div>
		<div class="middle quantity">
			<div class="num">数量:</div>
			<div class="minusPlus" @click="minus()"><span class="el-icon-minus"></span></div>
			<div class="goodsNum" v-model='goodsNum'>{{goodsNum}}</div>
			<div class="minusPlus" @click="plus()"><span class="el-icon-plus"></span></div>
			<!-- <div class="numButton" style="margin-left:.32rem;">2</div>
			<div class="numButton">3</div>
			<div class="numButton">4</div> -->
			<!-- <div class="numButton">5</div> -->
			<!-- <div class="numButton">6</div> -->
		</div>
		<div class="bottom goodsDetail">
			<span class="el-icon-goods"></span>
			<h1> &nbsp;商品详情</h1>
			<div v-for="item in goodsDetail.goodsDetailImg"  style="margin-bottom:-.346rem">
				<img :src="item.sourceUrl">
			</div>
			
		</div>
		
		<!-- 弹窗 -->
		<mt-popup class="popContent" v-model="popupBuy" popup-transition="popup-fade">
	        <div>
	          <h1>购买成功</h1>
	          <p>是否继续支付{{ lotteryFee }}元，参与促销?</p>
	            <div class="confirm" @click="submitSale()">促销</div>          	
	          	<router-link :to="{name: 'takeGoods', params: {rootOrder: JSON.stringify(rootOrder),goodsDetail: JSON.stringify(goodsDetail)}}">
	          		<div class="cancel" style="color:#666">提货</div>
	          	</router-link>
	        </div>
	    </mt-popup>

	    <mt-popup class="popContent" v-model="popupUpdate" popup-transition="popup-fade">
	        <div>
	          <h1>选择升级方式</h1>
	          <router-link class="deleteline" :to="{name: 'guessJO', params: {rootOrder: JSON.stringify(rootOrder)}}">
	            <div class="guessJO" @click="guessJO()">猜鸡藕</div>
	          </router-link>
	          <router-link class="deleteline" :to="{name: 'openRedPacket', params: {rootOrder: JSON.stringify(rootOrder)}}">  
	            <div class="openRedPacket" @click="openRedPacket()">拆红包</div>
	          </router-link>  
	        </div>
	    </mt-popup>

	</div>
	<div class="fixedBottom">
		<p>余额:</p>
		<div class="balance"><span>¥</span>{{ myInfo.balance / 100 }}</div>
		<div class="buy" @click="buyConfirm(goodsDetail)">立即购买</div>
	</div>
</div>
</template>

<script>
import axios from 'axios'
import { MessageBox } from 'mint-ui'
export default {
  name: 'index',
  data () {
    return {
    	buy:true,
    	rootOrder:{},
    	lotteryFee:'',
    	goodsDetail:{},
    	memberLoginInfo:{
	      openid:'',
          type: 'wx'
	    },
	    lotteryFromRootOrderVo:{
	        lotteryOddEvenChoose: '',
	        lotteryResult: 'init',
	        lotteryType: '',
	        rootOrderId: ''
        },
    	myInfo:{
    		balance: 0
    	},
    	popupUpdate:false,
    	popupBuy:false,
    	goodsDetail:{},
    	goodsNum: 1,
    	rootOrderVo:{
		  goodsId: '',
		  memberId: '',
		  orderDesc: '',
		  orderNum: 1,
		  userId: ''
		}
    }
  },
  created () {
    let self = this
    if(sessionStorage.getItem('myInfo') != null){
    	this.myInfo = JSON.parse(sessionStorage.getItem('myInfo'))
    }
    this.goodsId = this.$route.params.id
    axios.get('/bestlifeweb/goods/goodsDetail?goodsId=' + self.goodsId).then(function (res) {
        self.goodsDetail = res.data.data
    })
  },
  methods:{
  	handleChange(index) {
	},
  	minus: function () {
  		if (this.goodsNum > 1 ) {
  			this.goodsNum--
  		}
  	},
  	plus: function(){
  		this.goodsNum++
  	},
  	submitSale:function(){  //确认参与促销
      this.popupBuy = false
      this.popupUpdate = true      
    },
  	buyConfirm:function(goodsDetail){
  	  var goodsDetail = goodsDetail
  	  var lotteryRate = sessionStorage.getItem('lotteryRate') / 100
  	  this.lotteryFee = (goodsDetail.goodsPrice * this.goodsNum / 100 * lotteryRate).toFixed(2)
  	  if(goodsDetail.goodsPrice * this.goodsNum >  this.myInfo.balance){
  	  	alert('余额不足，请充值后购买！')
  	  	return
  	  }
  	  //防止多次点击购买
  	  if(this.buy){
  		this.isLogin()
  		this.buy = false
  	  }
  	  setTimeout(function(){
        this.buy = true
      },100)
    },
    isLogin: function () {
		let self = this
		if(sessionStorage.getItem('myInfo') != null){
			if(JSON.parse(sessionStorage.getItem('myInfo')).userId == '1'){
				alert('请联系业务员切换经销商')
				return
			}
		}
		this.rootOrderVo.goodsId = this.goodsDetail.goodsId
		this.rootOrderVo.orderDesc = this.goodsDetail.goodsName
		this.rootOrderVo.orderNum = this.goodsNum
		this.rootOrderVo.userId = JSON.parse(sessionStorage.getItem('myInfo')).userId
		this.rootOrderVo.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
		axios({
	        method: 'post',
	        url: '/bestlifeweb/order/memberCreateRootOrder',
	        headers: {'Content-Type': 'application/json'},
	        data: this.rootOrderVo
		}).then(function (res) {
			self.rootOrder = res.data.data          			    		
	    	self.popupBuy = true
		}).catch(function(err){
          alert(err)
      	})  
    }
  }  
}
</script> 

<style scoped>
.container{}
.main{
  width: 100%;
  background-color: #f3f3f3;
  -webkit-overflow-scrolling : touch;
  position:absolute;
  top:0px; 
  bottom:.98rem;
  overflow-y: scroll;
}
.deleteline{
  text-decoration: none;
}
.top{
	border-bottom: 0.02rem solid #efefef;
	background-color: #fff;
}
.banner{
	width: 100%;
	height: 104vw;
}
.top img{
	width: 100%;
	height: 100vw;
}
.top h1{
	font-size: .28rem;
	font-weight: normal;
	margin-left: .24rem;
	margin-right: .24rem;
	margin-top: -.2rem
}
.top span{
	font-size: .32rem;
	color: #ff8452;
}
.top h2{
	font-size: .44rem;
	color: #ff8452;
	margin-left: .24rem;
	margin-top: -.1rem;
}
.top h3{
	font-size: .24rem;
	color: #999;
	font-weight: normal;
	margin-top: -.4rem;
	margin-left: .24rem;
	margin-right: .24rem;
	margin-bottom: .2rem;
}
.middle{
	height: 1.04rem;
	background-color: #fff;
	/*background-color: #ccc;*/
}
.middle .num{
	font-size: .28rem;
	color: #333;
	line-height: 1.04rem;
	margin-left: .24rem;
	margin-right: .24rem;
	float: left;
}
.goodsNum{
	font-size: .28rem;
	color: #333;
	line-height: 1.04rem;
	margin-left: .24rem;
	margin-right: .24rem;
	margin-top: .05rem;
	float: left;
}
.minusPlus{
	width: .55rem;
	height: .55rem;
	margin-top: .28rem;
	background-color: #ebebeb;
	font-size: .35rem;
	color: #999;
	text-align: center;
	line-height: .55rem;
	float: left;
	border-radius: .05rem;
}
.numButton{
	width: .7rem;
	height: .5rem;
	float: left;
	background-color: #fe5455;
	border-radius: .05rem;
	margin-right: .24rem;
	margin-top: .3rem;
	font-size: .28rem;
	color: #fff;
	text-align: center;
	line-height: .5rem;
}
.bottom{
	width: 100%;
	height: auto;
	margin-top: .2rem;
	background-color: #fff;
	padding-bottom: .3rem;
	padding-top: .1rem;
}
.bottom img{
	width: 100%;
}
.bottom  span{
	font-size: .32rem;
	color: #333;
	margin-left: .24rem;
	float: left;
	line-height: .78rem
}
.bottom h1{
	font-size: .32em;
	color: #333;
	margin-left: .24rem;
	font-weight: normal;
	line-height: .36rem
}
.fixedBottom{
	width: 100%;
	height: .98rem;
	border-top: .01rem solid #efefef;
	position: fixed;
	bottom: 0;
	background-color: #fff;
}
.fixedBottom p{
	width: 13%;
	font-size: .32rem;
	color: #666;
	margin-left: 3%;
	float: left;
	margin-top: .26rem;
}
.fixedBottom span{
	font-size: .34rem;
}
.fixedBottom .balance{
	width: 46%;
	font-size: .4rem;
	color: #ff8452;
	line-height: .98rem;
	font-weight: bold;
	float: left;
	overflow: hidden;
}
.fixedBottom .buy{
	width: 38%;
	height: .98rem;
	float:right;
	background-color: #fe5455;
	font-size: .34rem;
	color: #fff;
	text-align: center;
	line-height: .98rem;
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
</style>