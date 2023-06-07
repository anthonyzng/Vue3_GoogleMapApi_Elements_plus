import { createApp,ref  } from "vue";
import App from './App.vue'
import './style.css'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import YamlContent from './config.yaml';

const app = createApp(App)
app.use(VueGoogleMaps, {
  load: {
    key: YamlContent.ApiKey,
    libraries: "places"
  },
})
app.use(ElementPlus)
app.mount('#app')