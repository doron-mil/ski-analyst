import {createApp} from 'vue';
import './style.css';
// @ts-ignore
import App from './App.vue';
import {IndexedDb} from './Utils/IndexedDb';

const app = createApp(App);

// app.config.globalProperties.$indexedDb = new IndexedDb();
app.provide('$indexedDb', new IndexedDb())

app.mount('#app');
