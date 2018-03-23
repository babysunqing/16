'use strict'
require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

var apiRouter = express.Router()

var goodsList = require('../data/goods/goodsList.json')
app.get('/bestlifeweb/goods/goodsList', function(req,res){
  res.json(goodsList);
})

var goodsDetail = require('../data/goods/goodsDetail.json')
app.get('/bestlifeweb/goods/goodsDetail', function(req,res){
  res.json(goodsDetail);
})

var getMemberAddressInfoList = require('../data/address/getMemberAddressInfoList.json')
app.get('/bestlifeweb/address/getMemberAddressInfoList', function(req,res){
  res.json(getMemberAddressInfoList);
})

var getMemberBankcardInfoList = require('../data/bankcard/getMemberBankcardInfoList.json')
app.get('/bestlifeweb/bankcard/getMemberBankcardInfoList', function(req,res){
  res.json(getMemberBankcardInfoList);
})

var getMemberOrderInfoList = require('../data/order/getMemberOrderInfoList.json')
app.get('/bestlifeweb/order/getMemberOrderInfoList', function(req,res){
  res.json(getMemberOrderInfoList); //获取订单列表
})

var getUserInfo = require('../data/user/getUserInfo.json')
app.get('/bestlifeweb/user/getUserInfo', function(req,res){
  res.json(getUserInfo); 
})

var getMemberCashFlowList = require('../data/memberCashFlow/getMemberCashFlowList.json')
app.get('/bestlifeweb/memberCashFlow/getMemberCashFlowList', function(req,res){
  res.json(getMemberCashFlowList); 
})

var memberLogin = require('../data/member/memberLogin.json')
app.get('/bestlifeweb/member/memberLogin', function(req,res){
  res.json(memberLogin); 
})

var memberRegister = require('../data/member/memberRegister.json')
app.post('/bestlifeweb/member/memberRegister', function(req,res){
  res.json(memberRegister); 
})

var getVerificationCode = require('../data/member/getVerificationCode.json')
app.get('/bestlifeweb/member/getVerificationCode', function(req,res){
  res.json(getVerificationCode); 
})

var getOpenidAndUserInfo = require('../data/member/getOpenidAndUserInfo.json')
app.get('/bestlifeweb/member/getOpenidAndUserInfo', function(req,res){
  res.json(getOpenidAndUserInfo); 
})


var getGuessOddEvenList = require('../data/guessOddEven/getGuessOddEvenList.json')
app.get('/bestlifeweb/guessOddEven/getGuessOddEvenList', function(req,res){
  res.json(getGuessOddEvenList); 
})

var memberCreateRootOrder = require('../data/order/memberCreateRootOrder.json')
app.post('/bestlifeweb/order/memberCreateRootOrder', function(req,res){
  res.json(memberCreateRootOrder); 
})

var memberPayoffRequest = require('../data/memberPayoff/memberPayoffRequest.json')
app.post('/bestlifeweb/memberPayoff/memberPayoffRequest', function(req,res){
  res.json(memberPayoffRequest); 
})

var memberLotteryFromRootOrder = require('../data/order/memberLotteryFromRootOrder.json')
app.post('/bestlifeweb/order/memberLotteryFromRootOrder', function(req,res){
  res.json(memberLotteryFromRootOrder); 
})

var addMemberBankcardInfo = require('../data/bankcard/addMemberBankcardInfo.json')
app.post('/bestlifeweb/bankcard/addMemberBankcardInfo', function(req,res){
  res.json(addMemberBankcardInfo); 
})

var applyForSeller = require('../data/seller/applyForSeller.json')
app.post('/bestlifeweb/seller/applyForSeller', function(req,res){
  res.json(applyForSeller); 
})

var pointGoodsList = require('../data/goods/pointGoodsList.json')
app.get('/bestlifeweb/goods/pointGoodsList', function(req,res){
  res.json(pointGoodsList); 
})

var getMemberPointFlowList = require('../data/memberPointFlow/getMemberPointFlowList.json')
app.get('/bestlifeweb/memberPointFlow/getMemberPointFlowList', function(req,res){
  res.json(getMemberPointFlowList); 
})

var memberCreatePointOrder = require('../data/order/memberCreatePointOrder.json')
app.post('/bestlifeweb/order/memberCreatePointOrder', function(req,res){
  res.json(memberCreatePointOrder); 
})

var getMemberPointOrderInfoList = require('../data/order/getMemberPointOrderInfoList.json')
app.get('/bestlifeweb/order/getMemberPointOrderInfoList', function(req,res){
  res.json(getMemberPointOrderInfoList); 
})

var addMemberAddressInfo = require('../data/address/addMemberAddressInfo.json')
app.post('/bestlifeweb/address/addMemberAddressInfo', function(req,res){
  res.json(addMemberAddressInfo); 
})

var memberTakeGoodsFromPointOrder = require('../data/order/memberTakeGoodsFromPointOrder.json')
app.post('/bestlifeweb/order/memberTakeGoodsFromPointOrder', function(req,res){
  res.json(memberTakeGoodsFromPointOrder); 
})

var memberTakeGoodsFromRootOrder = require('../data/order/memberTakeGoodsFromRootOrder.json')
app.post('/bestlifeweb/order/memberTakeGoodsFromRootOrder', function(req,res){
  res.json(memberTakeGoodsFromRootOrder); 
})

var memberTakeGoodsFromLottery = require('../data/order/memberTakeGoodsFromLottery.json')
app.post('/bestlifeweb/order/memberTakeGoodsFromLottery', function(req,res){
  res.json(memberTakeGoodsFromLottery); 
})

app.use('/', apiRouter)  

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port)
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
