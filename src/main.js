import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import TiffImageDisplay from './components/TiffImageDisplay.vue';


const app = createApp(App);

app.component('TiffImageDisplay', TiffImageDisplay);
app.use(router);
app.use(ElementPlus);

app.mount('#app');