import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue2vis/dist/vue2vis.css'
import 'bootstrap-select/dist/css/bootstrap-select.min.css'
import { Timeline } from 'vue2vis'
import {makeServer} from "@/server";


if (process.env.NODE_ENV === "development") {
  makeServer()
}


Vue.component('timeline', Timeline);
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)


new Vue({
  render: h => h(App),
}).$mount('#app')
