import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import router from './router'
import store from './store'
import 'mint-ui/lib/style.css'
import {Swipe, SwipeItem, Lazyload, Header, Button} from 'mint-ui'

// 消除点击3s延迟
fastclick.attach(document.body)

// mint-ui
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.use(Lazyload, {
  // 配置图片
  error: require('common/image/lazy_error.png'),
  loading: require('common/image/lazy_loading.png')
})
Vue.component(Header.name, Header)
Vue.component(Button.name, Button)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
