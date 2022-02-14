// Vue import
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vue3TouchEvents from "vue3-touch-events";
// FontAwesome import
import './assets/icon/fontAwesomeIcon'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(Vue3TouchEvents)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
