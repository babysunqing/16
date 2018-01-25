<template>
<div class="container" v-title="'银行卡管理'">
  <div class="itemContent" v-for="(item,index) in bankCardList"  :key='index' @click="choose(item)">
    <h1>{{ item.bankName }}</h1>
    <h2>储蓄卡</h2>
    <h3>{{ item.cardNum}}</h3>
    <span class="el-icon-delete" @click="deleteCard(item.bankcardId,index)"></span>
  </div>
  <router-link to="/newBankCard">
    <div class="fixedBottom" >+ 添加银行卡</div>
  </router-link>
  <!-- 弹出提示 -->
  <div>
    <mt-popup class="popContent" v-model="popup" popup-transition="popup-fade">
      <div>
        <p>删除银行卡？</p>
        <div class="confirm" @click="submit()">确定</div>
        <div class="cancel" @click="cancel()">取消</div>
      </div>
    </mt-popup>
  </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'address',
  data () {
    return {
      popup: false,
      bankCardList: [],
      chooseBank: {
        id: 0,
        index: 0
      }
    }
  },
  created() {  
    let self = this
    this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
    axios.get('/bestlifeweb/bankcard/getMemberBankcardInfoList?memberId=' + self.memberId)
    .then(function (res) {
      self.bankCardList = res.data.data
      for(var i = 0;i < self.bankCardList.length; i++){
        self.bankCardList[i].cardNum = self.bankCardList[i].bankcardId
        var reg = /^(\d{4})\d+(\d{4})$/
        self.bankCardList[i].cardNum = self.bankCardList[i].cardNum.replace(reg, "$1 **** **** $2")
      }
    })
  },
  methods:{
    deleteCard:function(id,index) {
      // 阻止事件在下传递
      event.stopPropagation()
      // 弹出对话框
      this.popup = true
      // 更新chooseBand状态
      chooseBank.id = id
      chooseBank.index = index
    },
    cancel:function(){
      this.popup = false
    },
    submit:function(){
      let self = this
      self.popup = false
      axios.get('/bestlifeweb/bankcard/deleteMemberBankcardInfo?bankcardId=' + self.chooseBank.id)
      .then(function (res) {
        self.bankCardList.splice(self.chooseBank.index,1)
        // self.bankCardList = res.data.data
        // // window.location.reload(true)
      }).catch(function(err){
          alert(err)
          self.$messagebox("删除失败,请检查网络是否异常!")
      });
    },
    choose:function(item){
      // 将信息传送给 withdraw
      this.$router.replace({name: 'withdraw', params: {bankCard:JSON.stringify(item)}})
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
.itemContent{
  width: 100%;
  height:auto;
  background-color: #fff;
  position: relative;
  padding-top: .3rem;
  padding-bottom: .24rem;
  border-bottom: .01rem solid #efefef;
}
h1{
  font-size: .32rem;
  color: #333;
  font-weight: normal;
  float: left;
  margin-left: .3rem;
  margin-right: .32rem;
  margin-top: 0;
  margin-bottom: 0;
}
h2{
  font-size: .28rem;
  color: #999;
  line-height: .48rem;
  font-weight: normal;
  margin-top: 0;
  margin-bottom: 0;
}
h3{
  font-size: .32rem;
  color: #333;
  font-weight: normal;
  margin-left: .24rem;
  margin-top: .1rem;
  margin-bottom:0;
}
span{
  float: right;
  font-size: .3rem;
  color: #999;
  margin-top: -.6rem;
  margin-right: .24rem;
}
.popContent{
  width: 5.4rem;
  background-color: #fff;
  border-radius: .26rem;
  text-align: center;
}
.popContent p{
  width: 90%;
  margin-left: 5%;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: .42rem;
  padding-bottom: .3rem;
  font-size: .28rem;
  color: #333;
  border-bottom: .01rem solid #efefef;
}
.popContent .confirm,.cancel{
  float: left;
  width:45%;
  height: .9rem;
  margin-left: 3.5%;
  line-height: .9rem;
  font-size: .26rem;
}
.confirm{
  color: #fe5455;
  border-right: .01rem solid #efefef;
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