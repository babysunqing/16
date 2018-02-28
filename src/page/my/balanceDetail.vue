<template>
<div class="container" v-title="'余额明细'">
  <!-- <div class="el-icon-loading loadingIcon" v-if="loadingIcon"></div> -->
  <div class="itemContent noData" v-if="list.length <= 0">暂无数据</div>
  <div class="itemContent" v-for="item in list">
    <h1>{{item.memberCashFlowDesc }}</h1>
    <h2>{{item.day }} {{item.time }}</h2>
    <h3 v-if="item.memberCashFlowType == 1">+{{ item.memberCashFlowNum/100}}</h3> <!-- 支出0 收入1 -->
    <h3 v-if="item.memberCashFlowType == 0" style="color:#333">-{{ item.memberCashFlowNum/100}}</h3>
  </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'pointDetail',
  data () {
    return {
      loadingIcon:true,
      list:[]
    }
  },
  created (){
    let self = this
    this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
    axios.get('/bestlifeweb/memberCashFlow/getMemberCashFlowList?memberId=' + self.memberId)
    .then(function (res) {
      // self.loadingIcon = false
      self.list = res.data.data
      if(self.list.length > 0){
        for(let i = 0; i < self.list.length; i++){
          let day = self.list[i].memberCashFlowTime
          self.list[i].day = new Date(parseInt(day) * 1000).toLocaleDateString()
          self.list[i].time = new Date(parseInt(day) * 1000).toLocaleTimeString('chinese',{hour12:false})
        }
      }
    })
  },
  methods:{
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
.loadingIcon{
  color: #999;
  text-align: center;
  margin-top: 40vh;
  margin-left:43vw
}
.noData{
  font-size: .32rem;
  color: #666;
  text-align:center;
}
.itemContent{
  width: 100%;
  height: .7rem;
  background-color: #fff;
  position: relative;
  padding-top: .4rem;
  padding-bottom: .4rem;
  border-bottom: .01rem solid #efefef;
}
h1{
  font-size: .32rem;
  color: #333;
  margin-left: .24rem;
  margin-top: 0;
  margin-bottom: 0;
}
h2{
  font-size: .26rem;
  color: #999;
  font-weight: normal;
  margin-left: .24rem;
  margin-top: .1rem;
  margin-bottom: 0;
}
h3{
  font-size: .42rem;
  color: #ff8452;
  font-weight: normal;
  position: absolute;
  right: .24rem;
  top:.5rem;
  margin-left: .24rem;
  margin-top: 0;
  margin-bottom: 0;
}
</style>
