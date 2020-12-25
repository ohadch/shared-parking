import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(VueLayers)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
