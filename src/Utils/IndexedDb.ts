import localForage from 'localforage';
import {GpxRecord} from '../model/GpxRecord';

export class IndexedDb {
    gpxStore: LocalForage;

    constructor() {
        localForage.config({
            driver: localForage.INDEXEDDB,
            name: 'SkiGpxManager',
            version: 1.0
        });

        this.gpxStore = localForage.createInstance({
            name: "gpx_store"
        });

    }

    getGpxRecord(aKey: string): GpxRecord | null {
        this.gpxStore.getItem<GpxRecord>(aKey).then((value: GpxRecord | null) => {
            return value;
        }).catch((err: any) => {
            throw err;
        });
        return null;
    }

    setGpxRecord(aKey: string, aValue: any) {
        this.gpxStore.setItem<GpxRecord>(aKey, aValue).then()
            .catch((err: any) => {
                throw err;
            });
    }

}
