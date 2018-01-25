// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import GetQueryString from './common/js/GetQueryString.js'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(MintUI)
Vue.use(ElementUI)
Vue.prototype.GetQueryString = GetQueryString

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App } 
})
// 设置title
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = binding.value
  }
})