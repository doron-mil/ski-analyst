import {Action} from 'vuex';
import {GeneralStateInterface} from './types.ts';

export const checkNotification: Action<GeneralStateInterface, any>
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
