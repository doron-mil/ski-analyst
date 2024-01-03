import {LiftData} from './LiftData.ts';
import {RunData} from './RunData.ts';

export interface SiteData {
    siteName: string;
    lifts: LiftData[];
    runs: RunData[];
}
