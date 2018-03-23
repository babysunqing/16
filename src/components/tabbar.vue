<template>
<div class="tabbar">
  <router-link class="tabbar-item"  to="/index">
    <div class="tabbar-item-icon">
    <div class="img"><img :src="indexImg" alt=""></div>
    <p v-bind:class="{ active: isActive1, 'normal': normal }">首页</p>
    </div>   
  </router-link>

  <router-link class="tabbar-item"  to="/exchange">
    <div class="tabbar-item-icon">
      <div class="img"><img :src="exchangeImg" alt=""></div>
      <p v-bind:class="{ active: isActive2, 'normal': normal }">兑换</p>
    </div>
  </router-link>

  <div class="tabbar-item">
    <div class="tabbar-item-icon"  @click="isLogin()">
      <div class="img"><img :src="myImg" alt=""></div>
      <p v-bind:class="{ active: isActive3, 'normal': normal }">我的</p>
    </div>
  </div>

  <router-view></router-view>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'tabbar',
  data () {
    return {
      resHaveThisUserId: false,
      resData:[],
      isDefault:false,
      url: '',
      isActive1: false,
      isActive2:false,
      isActive3:false,
      normal: true,
      indexBgInfo:{
        normal:'./static/tab_icon_home_n.png',
        hover:'./static/tab_icon_home_s.png' 
      },
      exchangeBgInfo:{
        normal:'./static/tab_icon_exchange_n.png',
        hover:'./static/tab_icon_exchange_s.png' 
      },
      myBgInfo:{
        normal:'./static/tab_icon_me_n.png',
        hover:'./static/tab_icon_me_s.png' 
      },
      indexImg: './static/tab_icon_home_n.png',
      exchangeImg: './static/tab_icon_exchange_n.png',
      myImg: './static/tab_icon_me_n.png' ,
      memberLoginInfo:{
        openid:''
      }
    }
  },
  methods: {
    isLogin: function () {
      this.$router.push({path:'/my'})
    },
    hoverBgInfo : function(type){
      if( type === 'index' ){
        this.indexImg = this.indexBgInfo.hover
        this.isActive1 = true
      }
      else if( type === 'exchange' ){
        this.exchangeImg = this.exchangeBgInfo.hover
        this.isActive2 = true
      }
      else if(type === 'my' ){
        this.myImg = this.myBgInfo.hover
        this.isActive3 = true
      }
        this.normal = false
    }
  }
}
</script>

<style scoped>
.tabbar{
  width: 100%;
  height:.85rem;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  position: fixed;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #efefef;
 }   
.tabbar-item{
  flex: 1;
  text-align: center;
  text-decoration: none;
  color: #a8a8a8;
}
.tabbar-item-icon{
  height:.85rem;
}     
.tabbar p{ 
  font-size: .18rem;
  margin-top: .55rem;
}
.normal{ 
  color:#a8a8a8;
}
.active{
  color:#fe5455;
}
img{
  width: .5rem;
  height: .5rem;
}
.img{
  width: .5rem;
  height: .5rem;
  margin-top: -.5rem;
  margin-left: 38%
}
</style>