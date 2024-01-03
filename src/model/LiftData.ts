import {PosRecord} from './PosRecord.ts';

export interface LiftData {
    liftName: string;
    id: string;
    type: string;
    nodes: PosRecord[];
}
