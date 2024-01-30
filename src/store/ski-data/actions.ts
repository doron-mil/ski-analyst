import {Action} from 'vuex';
import {SkiDataStateInterface} from './types.ts';
import {inject} from 'vue';
import {IndexedDb} from '../../Utils/IndexedDb.ts';

export const checkNotification: Action<SkiDataStateInterface, any>
    = async ({
                 state,
                 commit,
                 getters,
                 dispatch,
                 rootState
             }): Promise<void> => {

};

export const retrieveGpxDataAndUpdateStateIfNeeded: Action<SkiDataStateInterface, any>
    = async ({
                 state,
                 commit,
                 getters,
                 dispatch,
                 rootState
             }): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        let data = getters['skiData/getGpxData'];

        if (!data) {
            const indexedDb = inject('$indexedDb') as IndexedDb;
            data = await indexedDb.getGpxRecord('2024_01_01');
            if (data) {
                commit('setGpxRecord', data);
            }

        }

        resolve(data);
    });

};


// const _get = ({state, getters, dispatch, commit}, payload) => {
// };
//
// const _get = (context, payload) => {
// };
