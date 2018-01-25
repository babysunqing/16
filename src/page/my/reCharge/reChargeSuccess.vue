<template>
<div class="container" v-title="'积分明细'">
  <div class="top">
    <img src="../../../assets/success_icon.png">
    <h1>充值成功</h1>
  </div>
	<div class="middle">
    <div>
      <span>订单时间：</span>
      <p>{{ day }} {{ time }} </p>
    </div>
    <div style="margin-top:.12rem">
      <span>充值金额：</span>
      <p>¥{{memberPayInfo.payNum}}</p>
    </div>
  </div>
  <div class="finish" @click="goback()">完成</div>
</div>
</template>

<script>
export default {
  name: 'reChargeSuccess',
  data () {
    return {
      year:0,
    }
  },
  created(){
    this.memberPayInfo = JSON.parse(this.$route.params.memberPayInfo)
    var timeStamp = new Date().getTime() /1000
    this.day = new Date(parseInt(timeStamp) * 1000).toLocaleDateString()
    this.time = new Date(parseInt(timeStamp) * 1000).toLocaleTimeString('chinese',{hour12:false})
  },
  methods:{
    goback:function(){
      this.$router.replace({name: 'index'})
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
.top{
  text-align: center;
}
img{
  width: 1.65rem;
  height: 1.65rem;
  margin-top: .9rem;
}
h1{
  font-size: .3rem;
  color: #333;
  margin-top: 0;
  margin-bottom: 0
}
.middle{
  width: 100%;
  height: .82rem;
  margin-top: .64rem;
  padding-top: .4rem;
  padding-bottom: .4rem;
  background-color: #fff;
}
span{
  font-size: .28rem;
  color: #999;
  margin-left: .24rem;
  float: left;
  margin-top: 0;
  margin-bottom: 0
}
p{
  font-size: .28rem;
  color: #333;
  margin-top: 0;
  margin-bottom: 0;
  text-align: right;
  margin-right: .24rem;
}
.finish{
  width: 92%;
  height: .88rem;
  background-color: #fe5455;
  margin-top: .52rem;
  margin-bottom: .6rem;
  margin-left: 4%;
  border-radius: 30px;
  font-size: .34rem;
  color: #fff;
  line-height: .88rem;
  text-align: center;
}
</style>
