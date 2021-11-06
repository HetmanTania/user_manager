import { createApp } from 'vue'
import App from './App.vue'
import store from './store/store.js';
import router from './router/router.js';
import "../public/css/style.css"

createApp(App).use(store).use(router).mount('#app');
