import Vue from 'vue'
import App from './App'
import store from './store'
import fly from './api'
import '../static/font/iconfont.css'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store = store;
Vue.prototype.$http = fly;

const app = new Vue(App)
app.$mount()
