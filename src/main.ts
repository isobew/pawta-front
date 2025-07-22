import { createApp } from 'vue';
import ToastPlugin from 'vue-toast-notification';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './style.css';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(ToastPlugin);
app.mount('#app');

