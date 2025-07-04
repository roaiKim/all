import "./assets/main.css"
import "./assets/less/index.less"
import { createApp } from "vue"
import { createPinia } from "pinia"
import { errorListener } from "./service/error-listener"
import App from "./App.vue"
import router from "./router"
import { generatorModules } from "./service/loadService"
// import Antd from "ant-design-vue"

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(errorListener)
app.use(generatorModules)
// app.use(Antd)

app.mount("#app")
