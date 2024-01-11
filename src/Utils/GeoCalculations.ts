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

    static accountElevation2HaversineDistance(
        haversineDistance: number, alt1: number, alt2: number
    ): number {
        const elevationDiff = Math.abs(alt2 - alt1);

        const distanceWithElevation = Math.sqrt(Math.pow(haversineDistance, 2) + Math.pow(elevationDiff, 2));
        return distanceWithElevation;
    }

    static haversineDistanceCalculationWithElevation(
        lat1: number, lon1: number, alt1: number, lat2: number, lon2: number, alt2: number
    ): number {
        const distanceNoElevation = GeoCalculations.haversineDistanceCalculation(lat1, lon1, lat2, lon2);

        return GeoCalculations.accountElevation2HaversineDistance(distanceNoElevation, alt2, alt1);
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

    static distanceCalculationNoElevation(
        pos1: PosRecord, pos2: PosRecord
    ): number {
        return GeoCalculations.haversineDistanceCalculation(
            pos1.lat, pos1.lon, pos2.lat, pos2.lon);
    }

    static accountElevation2Distance(
        distanceNoElevation: number, pos1: PosRecord, pos2: PosRecord
    ): number {
        return GeoCalculations.accountElevation2HaversineDistance(
            distanceNoElevation, pos1.alt, pos2.alt,);
    }

    static distanceCalculationElevationNotMandatory(
        pos1: PosRecord, pos2: PosRecord
    ): number {
        let retResult = null;
        if (!pos1.alt || !pos2.alt) {
            retResult = GeoCalculations.distanceCalculationNoElevation(pos1, pos2);
        } else {
            retResult = GeoCalculations.distanceCalculation(pos1, pos2);
        }
        return retResult;
    }

    static bearingCalculationLonLat(
        lat1: number, lon1: number, lat2: number, lon2: number
    ): number {
        const dLonRad = GeoCalculations.deg2Rad(lon2 - lon1);
        const lat1Rad = GeoCalculations.deg2Rad(lat1);
        const lat2Rad = GeoCalculations.deg2Rad(lat2);

        const y = Math.sin(dLonRad) * Math.cos(lat2Rad);
        const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLonRad);
        const bearingRad = Math.atan2(y, x);
        const bearing = (bearingRad * 180 / Math.PI + 360) % 360; // in degrees
        return bearing;

        // const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
        // const x = Math.cos(φ1) * Math.sin(φ2) -
        //     Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
        // const brngRad = Math.atan2(y, x);
        // const brng = (brngRad * 180 / Math.PI + 360) % 360; // in degrees
        // return brng;
    }

    static bearingCalculation(
        pos1: PosRecord, pos2: PosRecord
    ): number {

        return GeoCalculations.bearingCalculationLonLat(pos1.lat, pos1.lon, pos2.lat, pos2.lon);
    }

}
