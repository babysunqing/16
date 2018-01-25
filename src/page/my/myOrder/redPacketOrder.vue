<template>
<div class="container" v-title="'拆红包'">
  <input type="radio" id="odd" class="regular-radio odd"  :value="random1" v-model='random' />
  <label for="odd"></label>  

  <input type="radio" id="even"  class="regular-radio even" :value="random2" v-model='random' />
  <label for="even"></label>  

  <div class="exit" @click="toMyPage()" v-if="item.lottery.lotteryResult == 'fail'">升级失败</div>
  <div class="exit" @click="toMyPage()" v-if="item.lottery.lotteryResult == 'success'">升级成功</div>


</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'myOrder',
  data () {
    return {
      rate: 0,
      random1: '',
      random2: '',
      random: ''
    }
  },
  created(){
    this.item = JSON.parse(this.$route.params.item)
  },
  methods:{
    toMyPage:function(){
      this.$router.replace({name: 'myOrder'})
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
  background: url(../../../assets/bg.png) no-repeat;
  background-size:100% 100%;
}
.exit{
  width: 74%;
  height: .88rem;
  background-color: #fe5455;
  margin-left: 13%;
  border-radius: 30px;
  font-size: .34rem;
  color: #fff;
  line-height: .88rem;
  text-align: center;
  position: fixed;
  bottom: 2rem;
}
.regular-radio {
  display: none;
}
.regular-radio + label {
  width: 1.86rem;
  height: 1.58rem;
  background-size: 100%;
  margin-top: 50vh;
  -webkit-appearance: none;
  display: inline-block;
  position: relative;
}
.odd + label{
  left: 13vw;
  background-image: url(../../../assets/bag_n.png);
}
.odd:checked + label{
  background-image: url(../../../assets/bag_s.png);
  left: 13vw;
}
.even + label{
  left: 22vw;
  background-image: url(../../../assets/bag_n.png);
}
.even:checked + label{
  background-image: url(../../../assets/bag_s.png);
  left: 22vw;
}
.regular-radio:checked + label:after {}
.popContent img{
  width: 4.04rem;
  height: 4.62rem
}
</style>