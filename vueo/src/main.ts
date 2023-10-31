import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18nPlugin from '@src/tools/i18n'

import App from './App.vue'
import router from './router'
import Coms from './components/subComponentRef.vue'

const app = createApp(App)
app.component("RoTu", Coms);

app.use(createPinia()   )
app.use(router)

app.use(i18nPlugin, {
    greetings: {
        hello: "rosen hello"
    }
});



app.mount('#app')
