<template>
<div class="container" v-title="'申请促销员'">
	<div class="content">
    <p class="name">姓名</p>
    <input class="nameInput"  type="text" name="" placeholder="请输入真实姓名" v-model="sellerApplication.trueName">
    <p class="card">身份证</p>
    <input class="cardInput" type="text" name="" placeholder="请输入身份证号" v-model="sellerApplication.identificationNumber">
    <router-link class="deleteline" :to="url">
     <div class="submit"  @click="submit()">
       提交
     </div>
    </router-link>
  </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'realName',
  data () {
    return {
      url: '',
      sellerApplication: {
        identificationNumber: '',
        memberId:'',
        trueName:'',
        userId:''
      }
    }
  },
  methods:{
    submit: function () {
      let self = this
      if(this.sellerApplication.trueName === ''){
        alert('请填写真实姓名')
        return
      }
      if(this.sellerApplication.identificationNumber === '' || /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.sellerApplication.identificationNumber) === false ){
        alert('请填写正确的身份证号码')
        return
      }
      this.sellerApplication.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
      this.sellerApplication.userId = JSON.parse(sessionStorage.getItem('myInfo')).userId
      axios({
        method: 'post',
        url: '/bestlifeweb/seller/applyForSeller',
        headers: {'Content-Type': 'application/json'},
        data: self.sellerApplication
      }).then(function (res) {
        self.$router.replace({name:'realNameSubmit',params: {seller: JSON.stringify(self.sellerApplication)}})
      })
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
  padding-top: .24rem;
	-webkit-overflow-scrolling : touch;
}
.deleteline{
  text-decoration: none;
}
.content{
  width: 94vw;
  height: auto;
  margin-left: 3vw;
  background-color: #fff;
  border-radius: .1rem;
  box-shadow: .02rem .03rem #f3e0e0;
  padding-top: .3rem;
  padding-bottom: .68rem;
  position: relative;
}
.name{
  margin-top: 0;
  margin-bottom: 0;
  font-size: .32rem;
  color: #666;
  margin-left: .4rem;
}
.card{
  margin-top: 1.7rem;
  margin-bottom: 0;
  font-size: .32rem;
  color: #666;
  margin-left: .4rem;
}
.nameInput{
  width: 85%;
  margin-bottom: 0;
  padding-bottom: .2rem;
  margin-left: .4rem;
  border: 0;
  border-bottom: .01rem solid #efefef;
  position: absolute;
  top: 1rem;
  font-size: .3rem;
  color: #666;
  outline: none;
}
.cardInput{
  width: 85%;
  margin-bottom: 0;
  padding-bottom: .2rem;
  margin-left: .4rem;
  border: 0;
  border-bottom: .01rem solid #efefef;
  position: absolute;
  top: 3.15rem;
  font-size: .3rem;
  color: #666;
  outline: none;
}
::-webkit-input-placeholder {
　　color:#999;
}
.submit{
  width: 88%;
  height: .84rem;
  margin-top: 1.64rem;
  margin-left: 6%;
  background-color: #ef5455;
  border-radius: .42rem;
  font-size: .34rem;
  color: #fff;
  text-align: center;
  line-height: .84rem;
}
</style>