import {createApp} from 'vue';

import './style.css';

import router from './router';
import store from './store';
import vuetify from './vuetify';

import App from './App.vue';

import {IndexedDb} from './Utils/IndexedDb';
import VueApexCharts from "vue3-apexcharts";


const app = createApp(App);


app.use(router);

app.use(store);

app.use(vuetify);

app.use(VueApexCharts);

app.provide('$indexedDb', new IndexedDb());

app.mount('#app');
