import {createApp} from 'vue';

import './style.css';

import {createStore} from 'vuex';

import store from './store';

import App from './App.vue';

import {IndexedDb} from './Utils/IndexedDb';
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);

app.use(store);

app.use(VueApexCharts);

app.provide('$indexedDb', new IndexedDb());

app.mount('#app');
