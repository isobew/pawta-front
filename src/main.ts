import { createApp } from 'vue';
import ToastPlugin from 'vue-toast-notification';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import './style.css';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); 

app.use(pinia);
app.use(router);

app.use(ToastPlugin);
app.mount('#app');

