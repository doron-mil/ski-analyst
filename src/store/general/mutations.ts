import type { Mutation } from 'vuex';

import {GeneralStateInterface} from './types.ts';


export const setVisibleSidebar: Mutation<GeneralStateInterface> = (state, payload): void => {
    // state.visibleSidebar = payload;
};

