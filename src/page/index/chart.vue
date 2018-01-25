<template>
<div class="container" v-title="'风云榜'">
	<img src="../../assets/bg2.png">
	<div class="content">
		<div class="title">
			<div class="titleitem">开奖时间</div>
			<div class="titleitem">开奖期数</div>
			<div class="titleitem">每期号码</div>
			<div class="titleitem">结果</div>
		</div>

		
		<div class="mui-table-view" 
			v-infinite-scroll="loadMore" 
			infinite-scroll-disabled="queryLoading" 
			infinite-scroll-distance="10" 
			infinite-scroll-immediate-check="false">
		
		<div class="item" v-for="(item,index) in list" v-bind:class="{ 'ou': index%2==0, 'qi': index%2==1 }">
			<div class="item1 time">
				<div class="time1">{{ item.day }}</div>
				<div class="time2">{{ item.time }}</div>
			</div>
			<div class="item1">{{ item.oddEvenPeriod }}</div>
			<div class="item1 oddEvenNum">{{ item.oddEvenNum }}</div>
			<div class="item1 oddeven" v-if="item.oddEvenResult == 'even' ">藕</div>
			<div class="item1 oddeven" v-if="item.oddEvenResult == 'odd' ">鸡</div>
		</div>
		
		 <div class="item" v-show="allLoaded" style="text-align:center;color:#fff">
		 	<span>已全部加载</span>
		 </div>

		 <div class="item" v-show="queryLoading" style="text-align:center;;color:#fff">
		 	<span>加载中....</span>
		 </div>

		</div>
		

      </p>

	</div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'chart',
  data () {
    return {
    	list:[],
    	//初始化无限加载相关参数
	    queryLoading: false, //加载中标志
	    allLoaded: false, //判断是否到达最大页数
	    totalNum: 0, // 总数目
	    totalPages: 0, // 总页数
	    pageSize: 0, //每页显示数
	    pageNum: 1, //当前页数
    }
  },
  created(){
    let self = this
    axios.get('/bestlifeweb/guessOddEven/getGuessOddEvenList?pageNo=' + this.pageNum).then(function (res) {
      // debugger
      // 记录当前页数、总页数、
      self.setPage(res.data.data)
      // 数据加载
      self.list = res.data.data.list
      // 构建时间日期
      self.setTime(self.list)
    })
  },
  computed: {
   params() {
    return{
     pageSize: this.pageSize
     }
   }
  },
  methods: {
   // 构建build参数
   setPage(data) {
     // this.pageNum  = data.pageNum
     this.pageSize = data.size
     this.totalNum = data.total
     this.totalPages = data.pages
   },
   // 构建 时间日期
   setTime(list) {
     if(list.length > 0){
        for(var i = 0; i < list.length; i++){
          var day = list[i].openTime
          list[i].day = new Date(parseInt(day) * 1000).toLocaleDateString()
          list[i].time = new Date(parseInt(day) * 1000).toLocaleTimeString('chinese',{hour12:false})
        }
     }
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
   	 	//
	    this.queryLoading = true
	    this.pageNum++
	    let self = this
	    axios.get('/bestlifeweb/guessOddEven/getGuessOddEvenList?pageNo=' + this.pageNum).then((res) => {
	      self.queryLoading = false
	      // res.data.data.list 设置日期
	      self.setPage(res.data.data)
	      self.setTime(res.data.data.list)
	      self.list = self.list.concat(res.data.data.list)	     
	    }).catch(function(err){
	      alert(err)
          self.$messagebox("获取失败,请检查网络是否异常!")
        })
	    //
   	 }
   }
   //
  } 
}
</script> 

<style scoped>
.container{
	width: 100%;
	height: 92%;
	padding-bottom: 3rem;
	background-color: #eb612b;
	overflow: auto;
	-webkit-overflow-scrolling : touch;
}
img{
	width: 100%;
	height: 4.5rem;
}
.qi{
	background: #fef5ea;
}
.ou{
	background: #fff;
}
.content{
	width: 100%;
	height: 100%;
	margin-top: -.4rem;
	background-color: #eb612b;
}
.title{
	height: .8rem;
	margin-left: .24rem;
	margin-right: .24rem;
	background-color: #fea133;
	border-radius: .2rem .2rem 0 0;
}
.titleitem{
	width: 25%;
	color: #fff;
	font-size: .24rem;
	float: left;
	text-align: center;
	line-height: .8rem;
}
.item{
	height: 1.12rem;
	margin-left: .24rem;
	margin-right: .24rem;
	color: #333;
	font-size: .24rem;
	line-height: 1.12rem;
}
.item1{
	width: 25%;
	float: left;
	text-align: center;
}
.oddeven{
	width: .68rem;
	height: .46rem;
	background-color: #fe5455;
	border-radius: .1rem;
	margin-top: .33rem;
	margin-left: 8%;
	color: #fff;
	line-height: .46rem;
}
.time1{
	height: .56rem;
	line-height: .7rem;
}
.time2{
	height: .56rem;
	line-height: .4rem;
}
.oddEvenNum{
	word-wrap: break-word;
	line-height: .36rem
}
</style>