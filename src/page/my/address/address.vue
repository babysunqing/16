<template>
<div class="container" v-title="'地址管理'">

  <div class="main">
    <mt-cell-swipe id="itemContent"
      v-for="(item,index) in AddressList"  :key='n'
      :right="[
         {content:'删除', style:{ backgroundColor: '#fe5454'  ,fontSize: '.26rem', color: '#fff' ,lineHeight: '1.96rem' ,marginTop: '-4rem'} , handler: ()=>remove(item,index)  }
      ]"  
      title="">
      <div class="itemContent">
        <!-- 联系人信息 -->
        <h1>{{ item.addressName }}</h1>
        <h2>{{ item.addressPhone }}</h2>
        <h3>{{ item.addressPositionTitle }}{{ item.addressPositionDetail }}</h3>
        <!-- 编辑 -->
        <span class="el-icon-edit-outline" @click="edit(item)"></span>
      </div>
    </mt-cell-swipe>
  </div>

  <router-link to="/newAddress">
    <div class="fixedBottom">+ 新增地址</div>
  </router-link>
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
      rootOrder:{}      
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
    remove(item,index) {
        let self = this
        axios.get('/bestlifeweb/address/deleteMemberAddressInfo?addressId=' + item.addressId).then(function (res) {
          this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
          axios.get('/bestlifeweb/maddress/getMemberAddressInfoList?memberId=' + self.memberId).then(function (res) {
            self.AddressList = res.data.data
            window.location.reload()
          })          
        })
    },
    edit:function(item){
      let EditData = item
      this.$router.push({name: 'editAddress', params: {editData: JSON.stringify(EditData)}})
      // 阻止时间在下传递
      event.stopPropagation()
    },
  }  
}
</script> 

<style scoped>
.main{
  width: 100%;
  background-color: #f3f3f3;
  -webkit-overflow-scrolling : touch;
  position:absolute;
  top:0px; 
  bottom:.8rem;
  overflow-y: scroll;
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