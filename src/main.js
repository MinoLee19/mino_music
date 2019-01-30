import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import router from './router'
import store from './store'
import 'mint-ui/lib/style.css'
import {Swipe, SwipeItem, Lazyload} from 'mint-ui'

// 消除点击3s延迟
fastclick.attach(document.body)

// mint-ui
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.use(Lazyload)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
