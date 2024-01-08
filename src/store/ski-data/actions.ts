import {Action} from 'vuex';
import {SkiDataStateInterface} from './types.ts';

export const checkNotification: Action<SkiDataStateInterface, any>
    = async ({
                 state,
                 commit,
                 getters,
                 dispatch,
                 rootState
             }): Promise<void> => {

};


// const _get = ({state, getters, dispatch, commit}, payload) => {
// };
//
// const _get = (context, payload) => {
// };
