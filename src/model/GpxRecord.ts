import {GpxOnePosRecord} from './GpxOnePosRecord';

export class GpxRecord {
    positionsRecords: GpxOnePosRecord[] = [];

    addPositionRecord(newPositionRecord: GpxOnePosRecord) {
        this.positionsRecords.push(newPositionRecord);
    }

    toJSON() {
        return this.positionsRecords;
    }
}
