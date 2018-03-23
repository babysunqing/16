<template>
<div class="container" v-title="'编辑银行卡'">
<div class="main">
  <input class="nameInput name" 
    type="text" name=""
    placeholder="姓名"
    v-model="bankcard.bankcardUsername">

  <input class="nameInput tel"
    type="text" name=""
    placeholder="身份证号"
    v-model="bankcard.bankcardIdentificationNumber" >

    <div class="nameInput bankName" @click="showClick">
      <div v-text="options[selected].text" class="bankNameinput"></div>
      <span class="el-icon-arrow-down"></span>
      <ul style="display: none;" v-show="show" class="bankNameBG">
        <li @click="select(optionIndex)" 
        v-for="(option, optionIndex) in options">{{option.text}}</li>
      </ul>
    </div>

  <input class="nameInput city" 
   type="text" name="" 
   placeholder="银行卡号"
   v-model="bankcard.bankcardId" 
   pattern="[0-9]*" 
   onkeyup="this.value=this.value.replace(/[^\w]/g,'');" >



   <input class="nameInput openBankName" 
   type="text" name="" 
   placeholder="开户行所在省份"
   v-model="bankcard.openBankName1"  >

   <input class="nameInput openBankName2" 
   type="text" name="" 
   placeholder="开户行所在城市"
   v-model="bankcard.openBankName2">

   <input class="nameInput openBankName3" 
   type="text" name="" 
   placeholder="开户行名称"
   v-model="bankcard.openBankName3">



  <input class="nameInput address"  
    type="number" 
    name="" 
    placeholder="银行卡预留手机号" 
    v-model="bankcard.bankcardPhone" pattern="[0-9]*">
</div>
  <div class="fixedBottom"  @click="submit()">保存</div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'newBankCard',
  data () {
    return {
      show: false,
      options: [
          { text: '请选择银行卡' },
          { text: '中国邮政储蓄银行' },
          { text: '中国工商银行' },
          { text: '中国农业银行' },
          { text: '中国建设银行' },
          { text: '交通银行' },
          { text: '招商银行' },
        ],
      selected: 0, // 代表选中的索引
      bankcard:{
        bankId: '',
        bankName: '',
        bankcardId: '',
        bankcardIdentificationNumber: '',
        bankcardPhone: '',
        bankcardUsername: '',
        openAccountBankName:'',
        memberId: '',
        userId: '',
        openBankName1:'',
        openBankName2:'',
        openBankName3:''
      }
    }
  },
  methods:{
    showClick() {
        this.show = !this.show
      },
      select(index) {
        this.selected = index
        this.bankcard.bankName = this.options[this.selected].text
      },
    submit: function () {
      let self = this
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if(this.bankcard.bankcardUsername == ''){
        alert('请输入姓名!')
        return
      }
      if(this.bankcard.bankcardIdentificationNumber == '' || reg.test(this.bankcard.bankcardIdentificationNumber) === false){
        alert('请填写正确的身份证号！')
        return
      }  
      if(this.bankcard.bankName == '请选择银行卡' || this.bankcard.bankName == ''){
        alert('请选择银行卡!')
        return
      }    
      if(this.bankcard.bankcardId == '' || this.bankcard.bankcardId.length > 20){
        alert('请输入正确的银行卡号!')
        return
      }
      // debugger
      if(this.bankcard.openBankName1 == ''){
        alert('请输入开户行所在省份!')
        return
      }
      if(this.bankcard.openBankName2 == ''){
        alert('请输入开户行所在城市!')
        return
      }
      if(this.bankcard.openBankName3 == ''){
        alert('请输入开户行名称!')
        return
      }
      if(this.bankcard.bankcardPhone == ''){
        alert('请输入银行卡预预留手机号!')
        return
      }
      if(this.bankcard.bankcardPhone.length != 11 && /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/.test(this.bankcard.bankcardPhone) === false){
        alert('请填写正确的手机号码！')
        return
      }
      else{
        this.bankcard.memberId = JSON.parse(sessionStorage.getItem('myInfo')).memberId
        this.bankcard.userId = JSON.parse(sessionStorage.getItem('myInfo')).userId
        this.bankcard.openAccountBankName = this.bankcard.openBankName1 + this.bankcard.openBankName2 + this.bankcard.openBankName3
        console.log(this.bankcard)
        axios({
          method: 'post',
          url: '/bestlifeweb/bankcard/addMemberBankcardInfo',
          headers: {'Content-Type': 'application/json'},
          data: self.bankcard
        }).then(function (res) {
          alert('添加成功！')
          window.history.go(-1)
        })
        .catch(function(err){
          alert(err.message)
        })
      }
    }
  }  
}
</script> 

<style scoped>
.container{
  width: 100%;
}
.main{
  width: 100%;
  background-color: #fff;
  -webkit-overflow-scrolling : touch;
  position:absolute;
  top:0px;
  bottom:.8rem;
  overflow-y: scroll;
  margin-bottom: .6rem;
}
.nameInput{
  outline: none;
  width: 92%;
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
.name{top: .2rem;}
.bankName{
  top: 1.8rem;
  z-index: 1
}
.tel{top: 1rem;}
.city{top: 2.6rem;}
.openBankName{top: 3.4rem;}
.openBankName2{top: 4.2rem;}
.openBankName3{top: 5rem;}
.address{top: 5.8rem;}
.bankNameBG{background-color: #fff}
.bankName .bankNameinput{
  width: 100%; 
}
.el-icon-arrow-down{
  color: #999;
  position: absolute;
  right: 0;
  top: .1rem;
}
ul{
  margin-top: .1rem;
  /*margin-left: -1%;*/
  border: .01rem solid #efefef;
  box-shadow: 0 0 .1rem #ddd;
}
li{
  width: 100%;
  height: .7rem;
  line-height: .7rem;
  margin-left: -12%;
  font-size: .26rem;
  list-style: none;
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
.select{
  width: 100%;
  margin-top: -.1rem
}
</style>