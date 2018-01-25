<template>
<div class="container" v-title="'实名发起'">
  <div class="top">
    <img src="../../../assets/success_icon.png">
    <h1>实名认证已提交</h1>
  </div>
	<div class="middle">
    <div>
      <span>姓名：</span>
      <p>{{ seller.trueName }}</p>
    </div>
    <div style="margin-top:.12rem">
      <span>身份证：</span>
      <p>{{ seller.identificationNumber }}</p>

    </div>
  </div>
  <router-link class="deleteline" to="/my">
    <div class="finish" @click="done()">完成</div>
  </router-link>
</div>
</template>

<script>
export default {
  name: 'realNameSubmit',
  data () {
    return {
      seller:{}
    }
  },
  created(){
    this.seller = JSON.parse(this.$route.params.seller)
  },
  methods:{
    done:function(){
      this.$router.replace({name: 'my'})
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
