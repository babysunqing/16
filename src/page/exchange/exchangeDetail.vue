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
			<h2>{{ goodsDetail.goodsPrice}}积分</h2>
			<h3>运费:{{ goodsDetail.goodsCarriageStartPrice / 100}}元(运费每件{{ goodsDetail.goodsCarriageStartPrice / 100}}元，此后每件依次加{{ goodsDetail.goodsCarriageAddPrice / 100}}元)</h3>
		</div>
		<div class="middle quantity">
			<div class="num">数量:</div>
			<div class="minusPlus" @click="minus()"><span class="el-icon-minus"></span></div>
			<div class="goodsNum" v-model='goodsNum'>{{goodsNum}}</div>
			<div class="minusPlus" @click="plus()"><span class="el-icon-plus"></span></div>
		</div>
		<div class="bottom goodsDetail">
			<span class="el-icon-goods"></span>
			<h1> &nbsp;商品详情</h1>
			<div v-for="item in goodsDetail.goodsDetailImg" style="margin-bottom:-.346rem">
				<img :src="item.sourceUrl">
			</div>
			
		</div>
		
		<!-- 弹窗 -->
		<mt-popup class="popContent" v-model="popupBuy" popup-transition="popup-fade">
	        <div>
	          <h1>兑换成功</h1>
	          <p>是否立即提货？</p>

	          <router-link :to="{name: 'takeGoods', params: {pointOrder: JSON.stringify(pointOrder),goodsDetail: JSON.stringify(goodsDetail)}}">
	            <div class="confirm">确认</div>          	
	          </router-link>

	          <div class="cancel" style="color:#666" @click="cancel()">取消</div>
	        </div>
	    </mt-popup>
	</div>
	<div class="fixedBottom">
		<p>积分:</p>
		<div class="balance">{{ myInfo.point }}</div>
		<div class="buy" @click="buyConfirm(goodsDetail)">立即兑换</div>
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
    	pointOrder:{},
    	lotteryFee:'',
    	goodsDetail:{},
    	memberLoginInfo:{
	      openid:'',
	      userId:'',
	      userInfo:{},
	    },
    	myInfo:{},
    	popupBuy:false,
    	goodsNum: 1,
    	pointOrderVo:{
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
  	cancel:function(){
      this.popupBuy = false     
    },
  	buyConfirm:function(goodsDetail){
  	  var goodsDetail = goodsDetail
  	  this.lotteryFee = goodsDetail.goodsPrice * this.goodsNum / 100
  	  if(goodsDetail.goodsPrice * this.goodsNum >  this.myInfo.point){
  	  	alert('积分不足，无法购买！')
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
  		this.pointOrderVo.goodsId = this.goodsDetail.goodsId
  		this.pointOrderVo.orderDesc = this.goodsDetail.goodsName
  		this.pointOrderVo.orderNum = this.goodsNum
  		this.pointOrderVo.userId = JSON.parse(sessionStorage.getItem('myInfo')).userId
  		this.pointOrderVo.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
    	axios({
	        method: 'post',
	        url: '/bestlifeweb/order/memberCreatePointOrder',
	        headers: {'Content-Type': 'application/json'},
	        data: this.pointOrderVo
    	}).then(function (res) {
    		self.pointOrder = res.data.data          			    		
        	self.popupBuy = true
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
	font-size: .32rem;
	color: #666;
	margin-left: .24rem;
	float: left;
	margin-top: .26rem;
}
.fixedBottom span{
	font-size: .32rem;
}
.fixedBottom .balance{
	font-size: .4rem;
	color: #ff8452;
	line-height: .98rem;
	font-weight: bold;
	float: left;
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