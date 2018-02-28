<template>
<div class="container" v-title="'积分商城'">
  <div class="main">
    <div class="el-icon-loading loadingIcon" v-if="loadingIcon"></div>
    <div class="empty" v-if="isShow">
      暂无积分商品
    </div>
    <div class="goodsContent" v-if="pointGoodsList.length > 0">
      <div class="goods" v-for="item in pointGoodsList">
        <router-link class="deleteline" :to="{name: 'exchangeDetail', params: {id:item.goodsId}}">
          <img :src="item.goodsShowingImg.sourceUrl">
          <p class="goodsName">{{ item.goodsName }}</p>
          <div class="buyPrice">
            <p class="price">{{ item.goodsPrice}}积分</p>
            <div class="buy">兑换</div>
          </div>
        </router-link>
      </div>
    </div>
    
  </div>
  <tabbar ref="tabbar" ></tabbar>
</div>
</template>

<script>
import axios from 'axios'
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
      pointGoodsList:[],
      isShow:false
    }
  },
  created () {
    //获取商品
    let self = this
    axios.get('/bestlifeweb/goods/pointGoodsList')
    .then(function (res) {
      self.loadingIcon = false
      self.pointGoodsList = res.data.data
      if(self.pointGoodsList.length <= 0){
          self.isShow = true
        }
    })
    .catch(function(err){
      alert(err)
    })
  },
  methods:{},
  mounted (){
    let self = this
    self.$refs.tabbar.hoverBgInfo('exchange')
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
  top:0rem; 
  bottom:.85rem;
  overflow-y: scroll;
  padding-top: .2rem;
}
.loadingIcon{
  color: #999;
  text-align: center;
  margin-top: 40vh;
  margin-left:43vw;
}
.confirmButton{
  font-size: .4rem;
  color: #fe5454;
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
.goods .goodsName{
  height: .8rem;
  font-size: .28rem;
  color: #333;
  margin: -.2rem .12rem;
  overflow: hidden;
}
.deleteline{
  text-decoration: none;
}
.goods img{
  width: 100%;
  height: 45vw;
}
.goods p{
  font-size: .28rem;
  color: #333;
  margin: -.2rem .12rem;
}
.buyPrice{
  width: 100%;
  margin-top: .36rem;
  margin-bottom: .14rem
}
.buyPrice p{
  font-size: .32rem;
  color: #ff8452;
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
.bg{
  font-size: .32rem;
  color: #333;
  text-align: center;
  margin-top: .3rem;
}
.empty{
  font-size: .3rem;
  color: #666;
  text-align: center;
  margin-top: .3rem;
}
</style>