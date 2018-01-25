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
        openid:'',
        type: 'wx'
      },
      indexForUrlUserId: -1,
      indexForMemberChooseDefaultUserId: -1,
      indexForDefaultUser: -1
    }
  },
  methods: {
    isLogin: function () {
      // 本地没有缓存过phone，跳转去登陆或注册
      if(localStorage.getItem('phone') == null){
        this.$router.replace({name: 'login'})
      }else{
        // 有缓存手机号，说明已经注册或登录过，这时候就去请求登录接口，看有没有返回相同的userId，
        // 有，就让他进入这个userId，没有就去在此userId下注册
        let self = this
        this.memberLoginInfo.phone = localStorage.getItem('phone')
        this.memberLoginInfo.openid = sessionStorage.getItem('openid')
        axios({
          method: 'post',
          url: '/bestlifeweb/member/memberLogin',
          headers: {'Content-Type': 'application/json'},
          data: self.memberLoginInfo
        }).then(function (res) {
          self.userId = sessionStorage.getItem('userId')
          self.resData = res.data.data
          sessionStorage.setItem("allMember",JSON.stringify(self.resData))

          self.indexForUrlUserId = -1
          self.indexForMemberChooseDefaultUserId = -1
          self.indexForDefaultUser = -1
          
          if(self.resData != null && self.resData.length > 0){
            // 初始化
            for(var i = 0; i < self.resData.length; i++){
              // url上对应的userId下标，有在此代理商注册过
              if(self.resData[i].member.userId == self.userId){
                self.indexForUrlUserId = i  
              }
              // 默认经销商的下标 ，有默认经销商
              if(self.resData[i].member.wxDefaultUser == 1){
                self.indexForMemberChooseDefaultUserId = i 
              }
              // 平台给的经销商的下标，在1注册过
              if(self.resData[i].member.userId == '1'){
                self.indexForDefaultUser = i 
              }
            }
          }

          // 从公众号进入
          if(self.userId == '1'){
            // 没有注册过
            if(self.resData == null || self.resData.length == 0){
              // 到1 代理商注册
              self.$router.push({path:'/register'})
              return
            }else{  
              // 有注册过，判断有没有默认代理商
              // 没有默认的代理商
              if(self.indexForMemberChooseDefaultUserId == -1){
                // 进入到1
                // alert('从1进来,没有有默认经销商')
                var index = self.indexForDefaultUser
                var member = self.resData[index].member
                sessionStorage.setItem("myInfo",JSON.stringify(member))
                sessionStorage.setItem("memberId",member.memberId)
                sessionStorage.setItem("userId",member.userId)
                self.$router.push({path:'/my'})
              }else{
                // 有默认 进入到默认
                // alert('从1，进来有默认经销商')
                var index = self.indexForMemberChooseDefaultUserId

                var member = self.resData[index].member
                sessionStorage.setItem("myInfo",JSON.stringify(member))
                sessionStorage.setItem("memberId",member.memberId)
                sessionStorage.setItem("userId",member.userId)
                self.$router.push({path:'/my'})
                return
              }
            }
          }

          // 从其他经销商进来，比如A
          if(self.userId != '1'){
            // 没有在A注册过
            if(self.indexForUrlUserId == -1){
              // 去A注册
              // alert('从A进来,没有在A注册过')
              self.$router.push({path:'/register'})
              return
            }else{
              //  有在A注册过，进入a,进入我的页面之后，自动设A为默认
              // alert('从A进来,有在A注册过')
              var member = self.resData[self.indexForUrlUserId].member
              sessionStorage.setItem("myInfo",JSON.stringify(member))
              sessionStorage.setItem("memberId",member.memberId)
              sessionStorage.setItem("userId",member.userId)
              self.$router.push({path:'/my'})
              return
            }
          }
        }).catch(function(err){
            alert(err)
        })
      }  
      
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