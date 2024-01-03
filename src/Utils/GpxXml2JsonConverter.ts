import {GpxModule} from '../model/GpxModule';
import {GpxRecord} from '../model/GpxRecord';
import moment from 'moment';
import {GpxOnePosRecord} from '../model/GpxOnePosRecord';
import {PosRecord} from '../model/PosRecord';
import {GeoCalculations} from './GeoCalculations';

export class GpxXml2JsonConverter {
    static convertGpxXml2GpxModule(xmlInput: string): GpxModule | null {
        const gpxRecord = new GpxRecord();
        let creationDate = moment();
        const xmlDoc = GpxXml2JsonConverter.getXmlDoc(xmlInput);

        const trackSegments = xmlDoc.getElementsByTagName("trkseg");
        const firstTrackSegment = trackSegments[0];

        const childrenCount = firstTrackSegment?.childNodes?.length;

        if (!childrenCount) {
            throw new Error('Not found any children for trkseg element');
        }

        let prevPosition: (PosRecord | null) = null;
        let momentTime, prevMomentTime: moment.Moment;

        for (let i = 0; i < (childrenCount ? childrenCount : 0); i++) {
            const childNode = firstTrackSegment.childNodes[i] as Element;
            if (childNode.nodeName != 'trkpt') {
                continue;
            }

            const latitude = childNode.getAttribute('lat');
            const lat = Number.parseFloat(latitude ? latitude : '0');

            const longitude = childNode.getAttribute('lon');
            const lon = Number.parseFloat(longitude ? longitude : '0');

            let time = '', alt = 0;
            const childNodesForOnePosRecord = childNode.childNodes;
            childNodesForOnePosRecord.forEach((node: Node) => {
                const val = node.childNodes[0].nodeValue;
                switch (node.nodeName) {
                    case 'time' :
                        momentTime = moment(val);
                        time = momentTime.format('hh:mm:ss');//, 'YYYY-MM-DDThh:mm:ssZ'
                        if (!gpxRecord.positionsRecords.length) {
                            creationDate = momentTime;
                        }
                        break;
                    case 'ele' :
                        alt = Number.parseFloat(val ? val : '0');
                        break;
                    default:
                        break;
                }
            });

            const newGpxOnePosRecord: GpxOnePosRecord = {
                time,
                lat,
                lon,
                alt
            };

            if (prevPosition) {
                newGpxOnePosRecord.dist = GeoCalculations.distanceCalculation(prevPosition, newGpxOnePosRecord);
                newGpxOnePosRecord.dEle = newGpxOnePosRecord.alt! - prevPosition.alt!;

                const deltaTime = momentTime.diff(prevMomentTime) / 1000; //in seconds
                newGpxOnePosRecord.speed = newGpxOnePosRecord.dist / deltaTime;
            }

            gpxRecord.addPositionRecord(newGpxOnePosRecord);
            prevPosition = newGpxOnePosRecord;
            prevMomentTime = momentTime;
        }
        return new GpxModule(creationDate, gpxRecord);
    }

    static getXmlDoc(xmlInput: string): Document {
        let xmlDoc = null;
        if (window.DOMParser) {
            const parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlInput, "text/xml");
        }
        // else  {// code for IE
        //
        //     xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        //     xmlDoc.async = false;
        //     // is there another way to do this load?
        //     xmlDoc.loadXML(xmlInput);
        // }

        if (!xmlDoc) {
            throw new Error('Can\'t establish Dom Parser');
        }

        return xmlDoc;
    }
}
