import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import GLOBAL from './assets/config';

Vue.prototype.$axios = axios;
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// 通过use方法加载axios插件
Vue.prototype.$GLOBAL = GLOBAL;
Vue.use(VueAxios,axios);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
