import Vue from 'vue'
import axios from './utils/http'

import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import VueParticles from 'vue-particles'
import vueSeamlessScroll from 'vue-seamless-scroll'
import 'iview/dist/styles/iview.css'
import './static/css/common.less'

Vue.use(iView)
Vue.use(VueParticles)
Vue.use(vueSeamlessScroll)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  data () {
    return {
      baseUrl: process.env.NODE_ENV !== 'production' ? 'http://test.weifenghr.com' : 'https://yun.weifenghr.com', // 测试服务器地址前缀
      cityArr: []
    }
  },
  mounted () {
    this.getCity()
  },
  methods: {
    getCity () {
      this.$http.get(`${this.baseUrl}/qthl-wf-policy/api/area/plug`)
        .then((resd) => {
          if (resd.code == 0) {
            function TraversalObject (arr) {
              for (let i in arr) {
                if (arr[i].children) {
                  TraversalObject(arr[i].children) // 递归遍历
                } else {
                  delete arr[i].children // 值就显示
                }
              }
              return arr
            }
            this.cityArr = TraversalObject(resd.result)
          }
        }, (err) => {
          console.log(err)
        })
    }
  },
  template: '<App/>'
}).$mount('#app')
