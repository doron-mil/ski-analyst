import {createApp} from 'vue';
import './style.css';
// @ts-ignore
import App from './App.vue';
import {IndexedDb} from './Utils/IndexedDb';
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);

// app.config.globalProperties.$indexedDb = new IndexedDb();
app.provide('$indexedDb', new IndexedDb())
app.use(VueApexCharts);

app.mount('#app');
