import {GpxRecord} from './GpxRecord';
import * as moment from 'moment';

export class GpxModule {

    constructor(creationDate: moment.Moment, gpxRecord: GpxRecord) {
        this.creationDate = creationDate;
        this.gpxRecord = gpxRecord;
    }

    creationDate: moment.Moment;
    gpxRecord: GpxRecord;
}
