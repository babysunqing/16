<template>
<div class="container" v-title="'选择地址'">
    <mt-cell-swipe id="itemContent"
      v-for="(item,index) in AddressList"  :key='n'
      :right="[
         {content:'删除', style:{ backgroundColor: '#fe5454'  ,fontSize: '.26rem', color: '#fff' ,lineHeight: '2rem' ,marginTop: '-.4rem'} , handler: ()=>remove(item,index)  }
      ]"  
      title="">
      <!-- 联系信息 -->
      <div class="itemContent"  @click="choose(item)">
        <h1>{{ item.addressName }}</h1>
        <h2>{{ item.addressPhone }}</h2>
        <h3>{{ item.addressPositionTitle }}{{ item.addressPositionDetail }}</h3>
        <!-- 编辑 -->
         <span class="el-icon-edit-outline" @click="edit(item)"></span>
      </div>
    </mt-cell-swipe>
  <!-- 新增地址 -->
  <div class="fixedBottom" @click="newAddress()">+ 新增地址</div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'address',
  data () {
    return {
      AddressList:[],
      n:'',
      pointOrder:{},
      rootOrder:{},
      goodsDetail:{}
    }
  },
  created() {  
    let self = this
    this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
    axios.get('/bestlifeweb/address/getMemberAddressInfoList?memberId=' + self.memberId).then(function (res) {
      self.AddressList = res.data.data
    })
  },
  methods:{
    newAddress:function () {
      this.goodsDetail = JSON.parse(this.$route.params.goodsDetail)
      if(this.$route.params.rootOrder == undefined){
        this.pointOrder = JSON.parse(this.$route.params.pointOrder)
        this.$router.replace({name: 'newAddress', params: {pointOrder: JSON.stringify(this.pointOrder),goodsDetail: JSON.stringify(this.goodsDetail)}})
      }
      if(this.$route.params.pointOrder == undefined){
        this.rootOrder = JSON.parse(this.$route.params.rootOrder)
        this.$router.replace({name: 'newAddress', params: {rootOrder: JSON.stringify(this.rootOrder),goodsDetail: JSON.stringify(this.goodsDetail)}})
      }
    },
    remove(item,index) {
        let self = this
        axios.get('/bestlifeweb/address/deleteMemberAddressInfo?addressId=' + item.addressId).then(function (res) {
          self.AddressList.splice(index,1)
          self.$messagebox("删除成功!")
        }).catch(function(err){
          self.$messagebox("删除失败,请检查网络是否异常!")
        });
    },
    edit:function(item){
      let EditData = item
      this.$router.push({name: 'editAddress', params: {editData: JSON.stringify(EditData)}})
      // 阻止时间在下传递
      event.stopPropagation()
    },
    choose:function(item){
      // 将信息传送给 takeGoods.vue
      // debugger
      this.goodsDetail = JSON.parse(this.$route.params.goodsDetail)
      if(this.$route.params.rootOrder == undefined){
        this.pointOrder = JSON.parse(this.$route.params.pointOrder)
        this.$router.replace({name: 'takeGoods', params: {pointOrder: JSON.stringify(this.pointOrder),goodsDetail: JSON.stringify(this.goodsDetail),address:JSON.stringify(item)}})
      }
      if(this.$route.params.pointOrder == undefined){
        this.rootOrder = JSON.parse(this.$route.params.rootOrder)
        this.$router.replace({name: 'takeGoods', params: {rootOrder: JSON.stringify(this.rootOrder),goodsDetail: JSON.stringify(this.goodsDetail),address:JSON.stringify(item)}})
      }
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
#itemContent{
  width: 100%;
  height: auto;
  position: relative;
}
.itemContent{
  width: 100%;
  height: 1.5rem;
  border-bottom: .01rem solid #efefef;
}
h1{
  font-size: .32rem;
  color: #333;
  font-weight: normal;
  position: absolute;
  left: .24rem;
  margin-right: .24rem;
  margin-top: .4rem;
  margin-bottom: 0
}
h2{
  width: 40%;
  font-size: .32rem;
  color: #333;
  font-weight: normal;
  margin-top: .4rem;
  margin-bottom: 0;
  position: absolute;
  left: 1.6rem;
}
h3{
  width: 70%;
  height: .4rem;
  font-size: .28rem;
  color: #999;
  font-weight: normal;
  margin-left: .24rem;
  margin-top: .94rem;
  margin-bottom: 0;
  position: absolute;
  left: 0;
}
span{
  position: absolute;
  right: .3rem;
  top: .66rem
}
.link{
  color: #999
}
.fixedBottom{
  width: 100%;
  height: .8rem;
  line-height: .8rem;
  position: fixed;
  bottom: 0;
  font-size: .26rem;
  color: #fff;
  text-align: center;
  background-color: #fe5454;
}
.delete{
  margin-top: -.4rem;
}
</style>