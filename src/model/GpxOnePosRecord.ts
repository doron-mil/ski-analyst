import {PosRecord} from './PosRecord';

export interface GpxOnePosRecord extends PosRecord{
    time: string;
    dist?: number;
    distE?: number;
    dEle?: number;
    speed?: number;
    bearing?: number;

}
