<template>
<div class="container" v-title="'地址管理'">
  <input class="nameInput name"  type="text" name="" placeholder="姓名" v-model="address.addressName" />
  <input class="nameInput tel"  type="number" name="" pattern="[0-9]*" placeholder="联系方式" v-model="address.addressPhone" />
  <input class="nameInput city"  type="text" name="" placeholder="请输入省市区" v-model="address.addressPositionTitle" />
  <input class="nameInput address"  type="text" name="" placeholder="请输入详细地址" v-model="address.addressPositionDetail" />
  <div class="fixedBottom" @click="submit()">+添加地址</div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'address',
  data () {
    return {
      address:{
        addressName: '',
        addressPhone: '',
        addressPositionDetail: '',
        addressPositionTitle: '',
        memberId: ''
      }
    }
  },
  created () {
    // debugger
    if(this.$route.params.goodsDetail != undefined){
      this.goodsDetail = JSON.parse(this.$route.params.goodsDetail)
    }
    if(this.$route.params.rootOrder != undefined){
      this.rootOrder = JSON.parse(this.$route.params.rootOrder)
    }
    if(this.$route.params.pointOrder != undefined){
      this.pointOrder = JSON.parse(this.$route.params.pointOrder)
    }
  },
  methods:{
    submit: function () {
      let self = this
      if(this.address.addressName == ''){
        alert('请输入姓名')
        return
      }
      if(this.address.addressPhone == ''){
        alert('请输入联系方式')
        return
      }
      if(this.address.addressPositionTitle == ''){
        alert('请输入省市区')
        return
      }
      if(this.address.addressPositionDetail == ''){
        alert('请输入详细地址')
        return
      }
      if(this.address.addressPhone.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(this.address.addressPhone)){
        this.address.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
        axios({
          method: 'post',
          url: '/bestlifeweb/address/addMemberAddressInfo',
          headers: {'Content-Type': 'application/json'},
          data: self.address
        }).then(function (response) {
          alert('添加成功')
          // debugger
          if (self.$route.params.goodsDetail != undefined) {
            if (self.$route.params.rootOrder != undefined) {
              self.$router.replace({name: 'chooseAddress', params: {rootOrder: JSON.stringify(self.rootOrder),goodsDetail: JSON.stringify(self.goodsDetail)}})
            }
            if (self.$route.params.pointOrder != undefined) {
              self.$router.replace({name: 'chooseAddress', params: {pointOrder: JSON.stringify(self.pointOrder),goodsDetail: JSON.stringify(self.goodsDetail)}})
            }
          }
          else{
            window.history.go(-1)
          }
        })
        }else{
          alert('请填写正确的手机号码！')
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
  background-color: #fff;
  -webkit-overflow-scrolling : touch;
}
.nameInput{
  outline: none;
  width: 92%;
  height: .4rem;
  margin-left: 4%;
  padding-bottom: .2rem;
  border: 0;
  border-bottom: .01rem solid #efefef;
  font-size: .26rem;
  color: #333;
  position: absolute;
}
::-webkit-input-placeholder {
　　color:#999;
}
.name{
  top: .2rem;
}
.tel{top: 1rem;}
.city{
 top: 1.8rem;
}
.address{
  top: 2.6rem;
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
</style>