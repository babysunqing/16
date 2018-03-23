<template>
<div class="container" v-title="'鼎汇购物商城'">
	<div class="main">
		<div class="banner">
			<mt-swipe>
			  <mt-swipe-item @change="handleChange" v-for="(item,index) in banner" :key="index">
			  	<img :src="item.sourceUrl">
			  </mt-swipe-item>
			</mt-swipe>
		</div>
		<div class="top">
			<div class="notice">
				<img src="../assets/inform_icon.png">
				<p>[鼎汇购物商城]幸运促销！</p>
			</div>
			<div class="navbar">
				<router-link to="/playMethod">
					<div class="navbarItem">
						<img src="../assets/introduce_icon.png">
						<p>玩法介绍</p>
					</div>
				</router-link>

				<router-link to="/exchange">
					<div class="navbarItem">
						<img src="../assets/Shopping_icon.png">
						<p>积分商城</p>
					</div>
				</router-link>

				<router-link to="/chart">
					<div class="navbarItem">
						<img src="../assets/list_icon.png">
						<p>风云榜</p>
					</div>
				</router-link>
				
				<router-link to="/reCharge"><!-- @click="alertTips()" -->
					<div class="navbarItem" >
						<img src="../assets/recharge_icon.png">
						<p>余额充值</p>
					</div>
				</router-link>
			</div>
		</div>
		<div class="clear"></div>
		<div class="content">
			<div class="title">
				<h1>全部商品</h1>
				<h2>ALL GOODS</h2>
			</div>
			<div class="el-icon-loading loadingIcon" v-if="loadingIcon"></div>
			<div class="goodsContent" >
				<div class="goods"  v-for="item in goodsList">
					<router-link class="deleteline" :to="{name: 'goodsDetail', params: {id:item.goodsId}}">
						<img :src="item.goodsShowingImg.sourceUrl">
						<p class="goodsName">{{ item.goodsName }}</p>
						<div class="buyPrice">
							<p class="price">¥{{ item.goodsPrice / 100}}</p>
							<div class="buy">购买</div>
						</div>
					</router-link>
				</div>
			</div>
		</div>
	</div>
	<tabbar ref="tabbar"></tabbar>
</div>

</template>

<script>
import axios from 'axios'
import { Base64 } from 'js-base64'
import tabbar from '../components/tabbar.vue'
import { MessageBox } from 'mint-ui'
export default {
  name: 'index',
  components: {
    tabbar
  },
  data () {
    return {
      loadingIcon:true,
      memberLoginInfo:{
        phone:''
      },   
      myInfo:{},
      userInfo:{},
      goodsList:[],
      dataList:{},
      banner: [],
      userId:'1',
      indexForUrlUserId: -1,
      indexForMemberChooseDefaultUserId: -1,
      indexForDefaultUser: -1
    }
  },
  created () {
    let self = this
    this.code = self.GetQueryString('code')
    this.urlMemberInfo = self.GetQueryString('state')
    // 处理url
    if(this.code != null && this.urlMemberInfo != null){
    	// 把urlMemberInfo用从#分割成一个数组
    	this.urlMemberInfo = this.urlMemberInfo.split('#')
        this.urlMemberInfo = this.urlMemberInfo[0]
	    //解密
	    this.urlMemberInfo = Base64.decode(this.urlMemberInfo)
	    
	    sessionStorage.setItem("urlMemberInfo",this.urlMemberInfo)
	    // urlMemberInfo字符串转换成Json
	    if (typeof this.urlMemberInfo === 'string') {
	    	this.urlMemberInfo = JSON.parse(this.urlMemberInfo)
	    	sessionStorage.setItem("userId",this.urlMemberInfo.userId)
	    }
	}

	this.getUserInfo()
	
	
	//获取商品
    axios.get('/bestlifeweb/goods/goodsList').then(function (res) {
    	self.loadingIcon = false
        self.goodsList = res.data.data
    }).catch(function(err){
        alert('errmsg' + res.data.errmsg)
    })

    if(sessionStorage.getItem('openid') == '' || sessionStorage.getItem('openid') == null){
		axios.get('/bestlifeweb/member/getOpenidAndUserInfo?code=' + self.code)
		.then(function (res) {
	        self.userInfo = res.data.data
	        sessionStorage.setItem("openid",self.userInfo.openid)
	        sessionStorage.setItem("userInfo",JSON.stringify(self.userInfo))
	        self.isLogin()
	    }).catch(function(error){
	    	 alert('error.data' + JSON.stringify(error.response.data))
	    })
    }
  },
  methods: {
  	getUserInfo:function(){
  		let self = this
  		this.userId = sessionStorage.getItem('userId')
	    axios.get('/bestlifeweb/user/getUserInfo?userId=' + self.userId).then(function (res) {
	        self.dataList = res.data.data
	        sessionStorage.setItem("takegoodsRateOnLotterySuccess",self.dataList[0].takegoodsRateOnLotterySuccess)
	        sessionStorage.setItem("refundRateOnLotterySuccess",self.dataList[0].refundRateOnLotterySuccess)   
	        sessionStorage.setItem("pointMoneyExchangeRate",self.dataList[0].pointMoneyExchangeRate)
	        sessionStorage.setItem("lotteryRate",self.dataList[0].lotteryRate)

	        if(self.dataList != ''){
	        	self.banner = self.dataList[0].banner
	        	sessionStorage.setItem("banner",JSON.stringify(self.banner))
	        }
	    }).catch(function(err){
	        alert('error.data' + JSON.stringify(error.response.data))
	    })
  	},
	handleChange(index) {
	},
	alertTips:function () {
      alert('请联系促销员！')
    },
	isLogin: function () {
      if(localStorage.getItem('phone') == null){
        this.$router.replace({name: 'login'})
      }else{
        let self = this
        this.phone = localStorage.getItem('phone')
        axios.get('/bestlifeweb/member/memberLogin?phone=' + this.phone).then(function (res) {
	        if(res.data.code == 0){
	            self.member = res.data.data[0].member
	            sessionStorage.setItem("myInfo",JSON.stringify(self.member))
	            sessionStorage.setItem("memberId",self.member.memberId)
	            sessionStorage.setItem("userId",self.member.userId)
	        }else if(res.data.code == 1){
	            self.$router.replace({path:'/login'})
	        }
	    }).catch(function(error){
	        alert(JSON.stringify(error.response.data))
	    })
      }
    },
  },
  mounted (){
  	let self = this
  	self.$refs.tabbar.hoverBgInfo('index')
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
	bottom:.85rem;
	overflow-y: scroll;
}
.loadingIcon{
  color: #999;
  text-align: center;
  margin-left:44vw;
  font-size: .8rem;
}
.banner{
	width: 100%;
	height: 3.4rem;
}
.bannerItem{
	width: 100%;
}
.banner img{
	width: 100%;
	height: 3.4rem;
	border-radius: .1rem;
}
.notice{
	width: 100%;
	height: .76rem;
	background-color: #fff;
	border-bottom: 1px solid #f0f0f0;
	float: left;
}
.notice img{
	width: .34rem;
	height: .34rem;
	float: left;
	margin: .21rem .14rem 0 .24rem;
}
.notice p{
	font-size: .24rem;
	color: #666;
	letter-spacing: .005rem;
}
.navbar{
	width: 100%;
	height: 2rem;
	float: left;
	background-color: #fff;
}
.navbarItem{
	float: left;
	width: 25%;
	height: 2rem;
	text-align: center;
}
.navbar img{
	width: 1.04rem;
	height: 1.04rem;
	margin-top: .3rem;
}
.navbarItem p{
	font-size: .24rem;
	color: #333;
	margin-top: -.2rem;
}
.content{
	width: 100%;
	height: auto;
}
.title{
	padding-top: .56rem
}
.title h1{
	font-size: .4rem;
	text-align:center;
	color: #666;
}
.title h2{
	text-align:center;
	font-size: .28rem;
	color: #666;
	margin-top: -.3rem;
	font-weight: normal;
	margin-bottom: .32rem;
}
.goodsContent{
	width: 96.7%;
	min-height: 50vw;
	padding-left: 3.3%;
}
.goods{
	width:45vw;
	float: left;
	background-color: #fff;
	padding-bottom: .2rem;
	margin-right: 3.3vw;
	margin-bottom: .24rem;
}
.deleteline{
  text-decoration: none;
}
.goods img{
	width: 100%;
	height: 45vw;
}
.goods .goodsName{
	height: .8rem;
	font-size: .28rem;
	color: #333;
	margin: -.2rem .12rem;
	overflow: hidden;
}
.buyPrice{
	width: 100%;
	margin-top: .36rem;
	margin-bottom: .14rem
}
.buyPrice .price{
	font-size: .32rem;
	color: #ff8452;
	margin: -.2rem .12rem;
}
.buyPrice .buy{
	height: auto;
	padding:.01rem .08rem;
	float: right;
	font-size: .24rem;
	color: #fff;
	background-color: #fe5454;
	border-radius: .08rem;
	margin-right: .16rem;
	margin-top: -.2rem
}
</style>