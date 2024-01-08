import localForage from 'localforage';
import {GpxRecord} from '../model/GpxRecord';

export class IndexedDb {
    gpxStore: LocalForage;
    skiSiteStore: LocalForage;

    constructor() {
        localForage.config({
            driver: localForage.INDEXEDDB,
            name: 'SkiGpxManager',
            version: 1.0
        });

        this.gpxStore = localForage.createInstance({
            name: "gpx_store"
        });
        this.skiSiteStore = localForage.createInstance({
            name: "ski_site_store"
        });

    }

    async getGpxRecord(aKey: string): Promise<GpxRecord> | null {
        const retResult = new Promise<GpxRecord>((resolve, reject) => {
            this.gpxStore.getItem<GpxRecord>(aKey).then((value: GpxRecord | null) => {
                resolve(value);
            }).catch((err: any) => {
                reject(err);
            });

        });
        return retResult;
    }

    setGpxRecord(aKey: string, aValue: any) {
        this.gpxStore.setItem<GpxRecord>(aKey, aValue).then()
            .catch((err: any) => {
                throw err;
            });
    }

    getSkiSiteRecord(aKey: string): GpxRecord | null {
        this.skiSiteStore.getItem<GpxRecord>(aKey).then((value: GpxRecord | null) => {
            return value;
        }).catch((err: any) => {
            throw err;
        });
        return null;
    }

    setSkiSiteRecord(aKey: string, aValue: any) {
        this.skiSiteStore.setItem<GpxRecord>(aKey, aValue).then()
            .catch((err: any) => {
                throw err;
            });
    }

}
