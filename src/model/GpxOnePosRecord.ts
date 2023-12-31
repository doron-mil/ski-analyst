import {PosRecord} from './PosRecord';

export interface GpxOnePosRecord extends PosRecord{
    time: string;
    dist?: number;
    dEle?: number;

}
