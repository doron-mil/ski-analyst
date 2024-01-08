import {Getter} from 'vuex';
import {SkiDataStateInterface} from './types.ts';

export const getGpxData: Getter<SkiDataStateInterface, any> = (state) => {

    return state.gpxRecord;
};


// export const disc = (state) => {
//   return state.disc
// }


// export const getLoading = state => state.loading;
// export const getUserInfo = state => state.userInfo;
