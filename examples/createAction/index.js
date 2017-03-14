import Vue from 'vue'
import Vuex from 'vuex'

import App from './App'
import store from './store'

Vue.use(Vuex)

const app = new Vue({
  store: store,
  render: (h) => (App)
}).$mount('#app')
