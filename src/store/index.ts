import {createStore} from 'vuex';

import general from './general';
import skiData from './ski-data';

export default createStore({
    modules: {
        general,
        skiData
    }
});


