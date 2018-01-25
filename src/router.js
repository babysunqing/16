import Vue from 'vue'
import VueRouter from 'vue-router'
import login from './page/login.vue'
import register from './page/register.vue'

import index from './page/index.vue'
import goodsDetail from './page/index/goodsDetail.vue'
import chart from './page/index/chart.vue'
import takeGoodsFromRootOrder from './page/index/takeGoodsFromRootOrder.vue'

import exchange from './page/exchange.vue'
import exchangeDetail from './page/exchange/exchangeDetail.vue'
import takeGoodsFromPoint from './page/exchange/takeGoodsFromPoint.vue'
import chooseAddressToPoint from './page/exchange/chooseAddressToPoint.vue'

import my from './page/my.vue'
import reCharge from './page/my/reCharge/reCharge.vue' //充值
import reChargeSuccess from './page/my/reCharge/reChargeSuccess.vue' //充值成功
import pointDetail from './page/my/pointDetail.vue' //积分明细
import myOrder from './page/my/myOrder/myOrder.vue' //我的订单
import takeGoods from './page/my/myOrder/takeGoods.vue'
import chooseAddress from './page/my/myOrder/chooseAddress.vue'
import guessJO from './page/my/myOrder/guessJO.vue'
import openRedPacket from './page/my/myOrder/openRedPacket.vue'
import joOrder from './page/my/myOrder/joOrder.vue'
import redPacketOrder from './page/my/myOrder/redPacketOrder.vue'
import pointOrder from './page/my/pointOrder/pointOrder.vue'

import mySale from './page/my/mySale/mySale.vue' //我的促销
import address from './page/my/address/address.vue' //收货地址
import newAddress from './page/my/address/newAddress.vue' //新建收货地址
import editAddress from './page/my/address/editAddress.vue'

import bankCard from './page/my/bankCard/bankCard.vue' //银行卡管理
import newBankCard from './page/my/bankCard/newBankCard.vue'
import balanceDetail from './page/my/balanceDetail.vue' //余额明细
import withdraw from './page/my/withdraw/withdraw.vue' //余额提现
import withdrawSubmit from './page/my/withdraw/withdrawSubmit.vue' //余额提现申请已提交
import chooseBankCard from './page/my/withdraw/chooseBankCard.vue' 

import share from './page/my/share.vue' //邀请有奖
import playMethod from './page/my/playMethod.vue'
import realName from './page/my/realName/realName.vue'
import realNameSubmit from './page/my/realName/realNameSubmit.vue'

Vue.use(VueRouter)
const routes = [
  {
    name:'register',
    path: '/register',             // 注册
    component: register
  },
  {
    name:'login',
    path: '/login',             // 登录
    component: login
  },
  {
    path: '/',                 // 默认打开首页
    component: index
  },
  {
    name: 'index',
    path: '/index',             // 首页
    component: index
  },
  {
    name:'goodsDetail',
    path: '/goodsDetail/:id',             // 商品详情
    component: goodsDetail
  },
  {
    name:'takeGoodsFromRootOrder',
    path:'/takeGoodsFromRootOrder/:rootOrder/:goodsDetail',
    component:takeGoodsFromRootOrder
  },
  {
    path:'/chart',                    //风云榜
    component:chart
  },
  {
    path: '/exchange',             // 兑换
    component: exchange
  },
  {
    name:'exchangeDetail',
    path: '/exchangeDetail/:id',             // 兑换详情
    component: exchangeDetail
  },
  {
    name:'chooseAddressToPoint',
    path:'/chooseAddressToPoint',
    component: chooseAddressToPoint
  },
  {
    name:'takeGoodsFromPoint',
    path:'/takeGoodsFromPoint',
    component: takeGoodsFromPoint
  },
  {
    name:'my',
    path: '/my',             // 我的
    component: my
  },
  {
    path: '/reCharge',             // 我的 充值
    component: reCharge
  },
  {
    name: 'reChargeSuccess',
    path: '/reChargeSuccess',             // 我的 充值成功
    component: reChargeSuccess
  },
  {
    path: '/pointDetail',             // 我的 积分明细
    component: pointDetail
  },
  {
    name:'myOrder',
    path: '/myOrder',            // 我的订单
    component: myOrder
  },
  {
    name:'openRedPacket',
    path:'/openRedPacket/:rootOrder',          //拆红包
    component:openRedPacket
  },
  {
    name:'guessJO',
    path:'/guessJO/:rootOrder',               //猜鸡藕
    component:guessJO
  },
  {
    name:'redPacketOrder',
    path:'/redPacketOrder/:item',
    component:redPacketOrder
  },
  {
    name:'joOrder',
    path:'/joOrder/:item',
    component:joOrder
  },
  {
    name:'pointOrder',
    path:'/pointOrder',
    component:pointOrder
  },
  {
    path: '/mySale',             // 我的促销
    component: mySale
  },
  {
    path: '/address',             // 收货地址
    component: address
  },
  {
    name:'takeGoods',
    path: '/takeGoods',             // 收货地址 选择地址
    component: takeGoods
  },
  {
    name:'chooseAddress',
    path: '/chooseAddress',             // 收货地址 选择地址
    component: chooseAddress
  },
  {
    name:'newAddress',
    path: '/newAddress',             // 收货地址 新建地址
    component: newAddress
  },
  {
    name:'editAddress',
    path: '/editAddress/:editData',             // 收货地址 bianji地址
    component: editAddress
  },
  {
    path: '/bankCard',             // 银行卡管理
    component: bankCard
  },
  {
    path: '/newBankCard',             // 银行卡管理 添加银行卡
    component: newBankCard
  },
  {
    path: '/balanceDetail',             // 余额明细
    component: balanceDetail
  },
  {
    name:'withdraw',
    path: '/withdraw',             // 余额提现
    component: withdraw
  },
  {
    name:'withdrawSubmit',
    path:'/withdrawSubmit/:memberPayoffInfo',           //余额提现申请已提交
    component:withdrawSubmit
  },
  {
    name:'chooseBankCard',
    path:'/chooseBankCard',
    component:chooseBankCard
  },
  {
    path: '/share',             // 邀请有奖
    component: share
  },
  {
    path: '/realName',             // 实名认证
    component: realName
  },
  {
    path:'/playMethod',
    component:playMethod
  },
  {
    name:'realNameSubmit',
    path:'/realNameSubmit',           //实名认证已提交
    component:realNameSubmit
  }  
]
var router = new VueRouter({
  routes
})
export default router
