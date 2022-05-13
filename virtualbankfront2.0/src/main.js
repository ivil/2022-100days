import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入vant组件
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

Vue.config.productionTip = false

// 引入消息提示弹框
import { notify } from './utils/resetNotify.js';
Vue.prototype.$notify = notify;

// 全局过滤器
Vue.filter('formatMoney', function (value) {
  return '￥' + value.toFixed(2) + '元';
})

// 格式化金额，保留两位小数
Vue.filter('formatMoney1', function (value) {
  return value.toFixed(2);
})

//全局引入lottie组件
import lottie from 'vue-lottie';
Vue.component('lottie', lottie)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

