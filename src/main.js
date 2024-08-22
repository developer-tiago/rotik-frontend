import './assets/main.css'
import 'remixicon/fonts/remixicon.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueApexCharts from "vue3-apexcharts"

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(VueApexCharts)
app.use(pinia)
app.mount('#app')
