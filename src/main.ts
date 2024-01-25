import {createApp} from 'vue';

import './style.css';

import store from './store';

import 'vuetify/styles';
import {createVuetify} from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import {aliases, mdi} from 'vuetify/iconsets/mdi';
import "@mdi/font/css/materialdesignicons.css";

import App from './App.vue';

import {IndexedDb} from './Utils/IndexedDb';
import VueApexCharts from "vue3-apexcharts";


const app = createApp(App);

app.use(store);

const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    },
    components,
    directives,
});
app.use(vuetify);

app.use(VueApexCharts);

app.provide('$indexedDb', new IndexedDb());

app.mount('#app');
