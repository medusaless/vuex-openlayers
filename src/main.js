// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import vueresource from 'vue-resource'
import iView from 'iview';

import store from './vuex/store/mapstore'
import 'iview/dist/styles/iview.css';
import './css/main.css';

Vue.config.productionTip = false
Vue.use(iView);
Vue.use(Vuex);
Vue.use(vueresource);

new Vue({
  el: '#app',
  router,
  store:new Vuex.Store(store),
  template: '<App :mapoptions="mapOptions"/>',
  components: {
    App
  },
  data() {
    return {
      mapOptions: {
        center:[11584299.515343716, 3588842.0829273267],
        zoom:13
      }
    }
  }
})
