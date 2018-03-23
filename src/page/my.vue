<template>
<div class="container" v-title="'我的'">
  <div class="main"> 
    <div class="user">

      <div class="left">
        <h1>余额</h1>
        <h2>{{ myInfo.balance / 100 }}</h2>
        <router-link class="deleteline" to="/reCharge">
         <div class="detail">充值</div>
        </router-link> 
      </div>

      <div class="middel">
        <img :src="myInfo.headUrl">
        <p>{{ myInfo.wxNickName }}</p>
      </div>
     
      <div class="right">
        <h1>积分</h1>
        <h2>{{ myInfo.point}}</h2>
        <router-link class="deleteline" to="/pointDetail">
        <div class="detail">明细</div>
        </router-link>
      </div>

    </div>

    <div class="itemContent">

      <router-link to="/myOrder">
        <div class="item" style="margin-top:.24rem">
          <div class="title">我的订单</div>
          <img src="../assets/next_icon.png">
        </div>
      </router-link>

      <router-link to="/pointOrder">
        <div class="item">
          <div class="title">积分订单</div>
          <img src="../assets/next_icon.png">
        </div>
      </router-link>

      <router-link to="/mySale">
        <div class="item">
          <div class="title">我的促销</div>
          <img src="../assets/next_icon.png">
        </div>
      </router-link>

      <router-link to="/address">
        <div class="item">
          <div class="title">收货地址</div>
          <img src="../assets/next_icon.png">
        </div>
      </router-link>

      <router-link to="/bankCard">
        <div class="item">
          <div class="title">银行卡管理</div>
          <img src="../assets/next_icon.png">
        </div>
      </router-link>

      <router-link to="/balanceDetail">
        <div class="item" style="margin-top:.24rem">
          <div class="title">余额明细</div>
          <img src="../assets/next_icon.png">
        </div>
      </router-link>

      <router-link to="/withdraw">
        <div class="item">
          <div class="title">余额提现</div>
          <img src="../assets/next_icon.png">
        </div>
      </router-link>
      
      <router-link to="/share">
      <div class="item" style="margin-top:.24rem">
        <div class="title">邀请有奖</div>
        <img src="../assets/next_icon.png">
      </div>
      </router-link>

      <router-link to="/playMethod">
        <div class="item">
          <div class="title">玩法介绍</div>
          <img src="../assets/next_icon.png">
        </div>
      </router-link>

      <router-link to="/realName">
        <div class="item">
          <div class="title">申请促销员</div>
          <img src="../assets/next_icon.png">
        </div>
      </router-link>
    </div>
    <div class="exit" @click="logOff()">退出登录</div>


    
  </div>
  <tabbar ref="tabbar"></tabbar>
</div>
</template>

<script>
import tabbar from '../components/tabbar.vue'
import axios from 'axios'
export default {
  name: 'my',
  components: {
    tabbar
  },
  data () {
    return {
      myInfo:{}
    }
  },
  created () {
    let self = this
    this.phone = localStorage.getItem('phone')
    axios.get('/bestlifeweb/member/memberLogin?phone=' + this.phone).then(function (res) {
      self.myInfo = res.data.data[0].member
      sessionStorage.setItem("myInfo",JSON.stringify(self.myInfo))
    }).catch(function(error){
        alert(JSON.stringify(error.response.data))
    })
  },
  methods:{
    logOff:function(){
      localStorage.clear()
      sessionStorage.removeItem('myInfo')
      this.$router.push({path:'/login'})
    }
  },
  mounted (){
    let self = this
    self.$refs.tabbar.hoverBgInfo('my')
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
.user{
  width: 100%;
  height: 3rem;
  background-color: #fe5455;
  display: -webkit-box;
  display: flex;
}
.deleteline{
  text-decoration: none;
}
.left,.middle,.right{
  flex: 1;
  text-align: center;

}
.user h1{
  font-size: .28rem;
  color: #fff;
  margin-top: .94rem;
}
.user h2{
  font-size: .3rem;
  color: #fffc00;
  margin-top: -.1rem;
}
.user .detail{
  width: .86rem;
  text-align: center;
  height: auto;
  font-size: .24rem;
  color: #fff;
  border: 2px solid #fff;
  border-radius: .2rem;
  padding: .02rem;
  margin-left: 32%;
}
.middel img{
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 1.3rem;
  margin-top: .5rem;
}
.middel p{
  width: 1.3rem;
  text-align: center;
  font-size: .3rem;
  color: #fff;
  margin-top: -.1rem;
  height: .45rem;
  overflow: hidden;
}
.item{
  height: 1rem;
  line-height: 1rem;
  background-color: #fff;
  font-size: .28rem;
  color: #333;
  padding-left: .34rem;
  border-bottom: .01rem solid #efefef;
  border-bottom-width: 90%;
}
.item .title{
  float: left;
}
.item img{
  width: .24rem;
  height: .24rem;
  float: right;
  margin-top: .4rem;
  margin-right: .36rem;
}
.exit{
  height: .88rem;
  background-color: #fe5455;
  margin-top: .32rem;
  margin-bottom: .6rem;
  width: 84%;
  margin-left: 8%;
  border-radius: 30px;
  font-size: .34rem;
  color: #fff;
  line-height: .88rem;
  text-align: center;
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
</style>