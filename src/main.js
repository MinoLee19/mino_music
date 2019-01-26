import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'

// 消除点击3s延迟
fastclick.attach(document.body)

// 懒加载
Vue.use(VueLazyLoad, {
  loading: require('common/image/logo.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
