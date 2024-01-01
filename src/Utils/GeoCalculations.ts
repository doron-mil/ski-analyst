import {PosRecord} from '../model/PosRecord';

export class GeoCalculations {

    static R = 6372.8 * 1000;   //meters

    static deg2Rad(degree: number): number {

        const rad = degree * Math.PI / 180;

        return rad;
    }

    static haversineDistanceCalculation(lat1: number, lon1: number, lat2: number, lon2: number): number {
        let dLat, dLon, a, c: number;

        dLat = GeoCalculations.deg2Rad(lat2 - lat1);
        dLon = GeoCalculations.deg2Rad(lon2 - lon1);
        lat1 = GeoCalculations.deg2Rad(lat1);
        lat2 = GeoCalculations.deg2Rad(lat2);
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        c = 2 * Math.asin(Math.sqrt(a));
        return GeoCalculations.R * c;
    };

    static haversineDistanceCalculationWithElevation(
        lat1: number, lon1: number, alt1: number, lat2: number, lon2: number, alt2: number
    ): number {
        const distanceNoElevation = GeoCalculations.haversineDistanceCalculation(lat1, lon1, lat2, lon2);
        const elevationDiff = Math.abs(alt2 - alt1);

        const distanceWithElevation = Math.sqrt(Math.pow(distanceNoElevation, 2) + Math.pow(elevationDiff, 2));
        return distanceWithElevation;
    }

    static distanceCalculation(
        pos1: PosRecord, pos2: PosRecord
    ): number {
        if (!pos1.alt || !pos2.alt) {
            throw new Error('GeoCalculations.distanceCalculation got missing altitude data');
        }
        return GeoCalculations.haversineDistanceCalculationWithElevation(
            pos1.lat, pos1.lon, pos1.alt, pos2.lat, pos2.lon, pos2.alt);
    }

    static distanceCalculationElevationNotMandatory(
        pos1: PosRecord, pos2: PosRecord
    ): number {
        let retResult = null;
        if (!pos1.alt || !pos2.alt) {
            retResult = GeoCalculations.haversineDistanceCalculation(
                pos1.lat, pos1.lon, pos2.lat, pos2.lon);
        } else {
            retResult = GeoCalculations.distanceCalculation(pos1, pos2);
        }
        return retResult;
    }

}
