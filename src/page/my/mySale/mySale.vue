<template>
<div class="container" v-title="'我的促销'">
	<mt-navbar class="navbar" v-model="selected">
    <mt-tab-item id="1">
      <p>拆红包</p>
    </mt-tab-item>
    <mt-tab-item id="2"  >
      <p>猜鸡藕</p>
    </mt-tab-item>
    
  </mt-navbar>

  
  <mt-tab-container v-model="selected" >

    <mt-tab-container-item id="1"  >
      <div class="mui-table-view" 
      v-infinite-scroll="loadMore" 
      infinite-scroll-disabled="queryLoading" 
      infinite-scroll-distance="10" 
      infinite-scroll-immediate-check="false">
    
        <div class="itemContent" v-for="item in redpacketList">
          <div class="item" style="width:100%;height:.3rem">
            <h1>订单编号：{{item.lottery.lotteryId}}</h1><h1>...</h1>
            <h2>{{ item.rootOrder.day }} {{ item.rootOrder.time }}</h2>
          </div>       
          <div class="item">
            <h3>是否猜中：
              <span style="font-size:.3rem" v-if="item.lottery.lotteryResult == 'success'">是</span>
              <span style="font-size:.3rem" v-if="item.lottery.lotteryResult == 'fail'">否</span>

            </h3>
          </div>         
        </div>
    
        <div class="allLoaded" v-show="allLoaded" style="text-align:center;color:#666">
          <span>已全部加载</span>
        </div>

       <!--  <div class="item" v-show="queryLoading" style="text-align:center;;color:#fff">
         <span>加载中....</span>
        </div> -->
      </div>      
    </mt-tab-container-item>

    <mt-tab-container-item id="2">
      <div class="mui-table-view" 
      v-infinite-scroll="loadMore" 
      infinite-scroll-disabled="queryLoading" 
      infinite-scroll-distance="10" 
      infinite-scroll-immediate-check="false">
    
        <div class="itemContent" v-for="item in oddevenlist">
          <div class="item" style="width:100%;height:.3rem">
            <h1>订单编号：{{ item.lottery.lotteryId}}</h1><h1>...</h1>
            <h2>{{ item.rootOrder.day }} {{ item.rootOrder.time }}</h2>
          </div>
          <div class="item">
            <h3>是否猜中：
              <span style="font-size:.3rem" v-if="item.lottery.lotteryResult == 'success'">是</span>
              <span style="font-size:.3rem" v-if="item.lottery.lotteryResult == 'fail'">否</span>
              <span style="font-size:.3rem" v-if="item.lottery.lotteryResult == 'init'">开奖中</span>
            </h3>

            <h4 v-if="item.lottery.lotteryOddEvenChoose == 'even' ">鸡藕：<span>藕</span></h4>
            <h4 v-if="item.lottery.lotteryOddEvenChoose == 'odd' ">鸡藕：<span>鸡</span></h4>

          </div> 
          <div class="item" style="padding-bottom:.3rem" v-if="item.guessOddEven != null">
            <h3>期数：<span style="font-size:.3rem;color:#ff8452">{{ item.guessOddEven.oddEvenPeriod }}</span></h3>
            <h3>期数值：<p style="font-size:.3rem">{{ item.guessOddEven.oddEvenNum }}</p></h3>
          </div>
        </div>
    
        <div class="allLoaded" v-show="allLoaded" style="text-align:center;color:#666;">
          已全部加载
        </div>

      <!--   <div class="item" v-show="queryLoading" style="text-align:center;;color:#fff">
         <span>加载中....</span>
        </div> -->
      </div>
    </mt-tab-container-item>
  
  
  

  </mt-tab-container>

</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'mySale',
  data () {
    return {
      selected:'1',
      list:[],
      oddevenlist:[],
      redpacketList:[],
      //初始化无限加载相关参数
      // queryLoading: false, //加载中标志
      allLoaded: false, //判断是否到达最大页数
      totalNum: 0, // 总数目
      totalPages: 0, // 总页数
      pageSize: 0, //每页显示数
      pageNum: 1, //当前页数
    }
  },
  created(){
    let self = this
    this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
    axios.get('/bestlifeweb/order/getMemberOrderInfoList?memberId=' + self.memberId + '&pageNum=' + this.pageNum)
    .then(function (res) {
        // self.loadingIcon = false
        //记录返回的数据
        self.setPage(res.data.data)
        //第一页数据的数据加载
        self.list = res.data.data.list
        self.splitData(self.list)

    })
    .catch(function(err){
      // alert(err.message)
    })
  },
  computed: {
   params() {
    return{
     pageSize: this.pageSize //每页显示数
     }
   }
  },
  methods:{
    splitData:function(list){
      if(list.length > 0){
        for(var i = 0; i < list.length; i++){
            if(list[i].lottery != null){
            list[i].lottery.lotteryId = list[i].lottery.lotteryId.substring(0,7) 
            var day = list[i].rootOrder.createTime
            list[i].rootOrder.day = new Date(parseInt(day) * 1000).toLocaleDateString()
            list[i].rootOrder.time = new Date(parseInt(day) * 1000).toLocaleTimeString('chinese',{hour12:false})
            if(list[i].lottery != null){
              if(list[i].lottery.lotteryType == 'oddeven'){
                this.oddevenlist.push(list[i])         
              }else{
                this.redpacketList.push(list[i])
              }
            }
          } 
        }
      }
    },
    // 构建build参数
   setPage(data) {
     // this.pageNum  = data.pageNum
     this.pageSize = data.size
     this.totalNum = data.total
     this.totalPages = data.pages
   },
   // 判断是否到达最大页数
    // 返回true 说明已经最大页数
    // 返回false 说明还未到达
    isAllLoaded() {
      // 如果当前页数到达最大页数
      if(this.pageNum >= this.totalPages){
        this.allLoaded = true
        this.pageNum = this.totalPages
        return false
      }
      else{
        return true
      }
    },
    //下拉底部加载下一页数据
    loadMore() {
      // 显示查询加载图标
      if(this.isAllLoaded() ){
        // this.queryLoading = true
        this.pageNum ++
        let self = this
        this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
        axios.get('/bestlifeweb/order/getMemberOrderInfoList?memberId=' + self.memberId + '&pageNum=' + this.pageNum)
        .then((res) => {
          // self.queryLoading = false
          // res.data.data.list 设置日期
          self.setPage(res.data.data)
          self.splitData(res.data.data.list)
          self.list = self.list.concat(res.data.data.list)       
        }).catch(function(err){
          // alert(err)
        })
      }
    },
  }  
}
</script> 

<style scoped>
.container{
	width: 100%;
	height: 100%;
	overflow: auto;
	-webkit-overflow-scrolling : touch;
}
.item{
  width: 100%;
  height: .6rem;
}
.navbar{
  height: .78rem;
}
p{
  font-size:.3rem;
  margin-top: -.1rem;
  margin-bottom: 0;
}
.itemContent{
  padding: .4rem .24rem;
  position: relative;
  border-bottom: .01rem solid #efefef
}
h1,h2,h3,h4,span,p{
  margin-bottom: 0;
  margin-top: 0;
  font-weight: normal;
}
.itemContent h1{
  font-size: .26rem;
  color: #999;
  float: left;
}
.itemContent h2{
  font-size: .26rem;
  color: #999;
  float: right;
}
.itemContent h3{
  clear: both;
  font-size: .26rem;
  color: #333;
  float: left;
  margin-top: .14rem;
}
.itemContent span{
  color: #fe5455;

}
.itemContent h4{
  font-size: .26rem;
  color: #333;
  margin-top: .14rem;
  float: right;
}
.itemContent p{
  font-size: .3rem;
  color: #ff8452;
  float: right;
}
.allLoaded{
  font-size: .26rem;
  margin-top: .3rem;
  margin-bottom: .3rem
}
</style>