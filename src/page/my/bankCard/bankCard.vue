<template>
<div class="container" v-title="'银行卡管理'">

  <div class="main">
    <div class="itemContent" v-for="item in bankCardList">
      <h1>{{ item.bankName }}</h1>
      <h2>储蓄卡</h2>
      <h3>{{ item.cardNum }}</h3>
      <span class="el-icon-edit-outline edit" @click="editCard(item)"></span>
      <span class="el-icon-delete" @click="deleteCard(item)"></span>
      <mt-popup class="popContent" v-model="popup" popup-transition="popup-fade">
        <div>
          <p>删除银行卡？</p>
          <div class="confirm" @click="submit(item)">确定</div>
          <div class="cancel" @click="cancel()">取消</div>
        </div>
      </mt-popup>
    </div>
  </div>

  <router-link to="/newBankCard">
    <div class="fixedBottom" >+ 添加银行卡</div>
  </router-link>

</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'address',
  data () {
    return {
      bankcardId:'',
      popup:false,
      bankCardList:[]
    }
  },
  created() {  
    let self = this
    this.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
    axios.get('/bestlifeweb/bankcard/getMemberBankcardInfoList?memberId=' + self.memberId)
    .then(function (res) {
      self.bankCardList = res.data.data
      if(self.bankCardList.length > 0){
        for(var i = 0;i < self.bankCardList.length; i++){
          self.bankCardList[i].cardNum = self.bankCardList[i].bankcardId
          var reg = /^(\d{4})\d+(\d{4})$/
          self.bankCardList[i].cardNum = self.bankCardList[i].cardNum.replace(reg, "$1 **** **** $2")
        }
      }
    })
  },
  methods:{
    editCard:function(item){
      let EditData = item
      debugger
      this.$router.push({name: 'editBankCard', params: {editData: JSON.stringify(EditData)}})
      // 阻止时间在下传递
      event.stopPropagation()
    },
    deleteCard:function(item) {
      this.popup = true
      this.bankcardId = item.bankcardId
    },
    cancel:function(){
      this.popup = false
    },
    submit:function(){
      this.popup = false
      let self = this
      axios.get('/bestlifeweb/bankcard/deleteMemberBankcardInfo?bankcardId=' + self.bankcardId)
      .then(function (res) {
        self.bankCardList = res.data.data
        window.location.reload()
      })
    }
  }
}
</script>

<style scoped>
.container{}
.main{
  width: 100%;
  background-color: #f3f3f3;
  -webkit-overflow-scrolling : touch;
  position:absolute;
  top:0px; 
  bottom:.8rem;
  overflow-y: scroll;
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
.edit{
  margin-right: .88rem;
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