import {PosRecord} from './PosRecord.ts';

export interface RunData {
    liftName: string;
    id: string;
    type: string;
    nodes: PosRecord[];
}
