import type {Mutation} from 'vuex';

import {SkiDataStateInterface} from './types.ts';
import {GpxRecordInterface} from '../../model/types.ts';


export const setGpxRecord: Mutation<SkiDataStateInterface> =
    (state, payload: GpxRecordInterface): void => {
        state.gpxRecord = payload;
    };

