<template>
  <div>
    <input
        type="file"
        @change="onFileChanged($event)"
    />
  </div>
  <BR/>
  <BR/>
  <div>
    Import a Ski Site data file
    <input
        type="file"
        @change="onSkiSiteDataFileChanged($event)"
    />
  </div>
  <BR/>
  <BR/>
  <div>
    1st Point
    <input size="30" v-model="point1" type="text"/> <input size="6" v-model="point1Alt" type="text"/>
    <BR/>
    2nd Point
    <input size="30" v-model="point2" type="text"/> <input size="6" v-model="point2Alt" type="text"/>
    <BR/>
    <BR/>
    <button @click="calculateDistance">Calculate Distance</button>
    <BR/>
    <BR/>
    {{ calculatedDistance }}
  </div>


</template>

<script lang="ts">

import {GpxXml2JsonConverter} from '../Utils/GpxXml2JsonConverter';
import {ref, inject, reactive} from "vue";
import {IndexedDb} from '../Utils/IndexedDb';
import {GeoCalculations} from '../Utils/GeoCalculations.ts';
import {PosRecord} from '../model/PosRecord.ts';

export default {
  name: "MainScreen",
  setup() {
    const point1 = ref<string>('45.38903842,6.56744612');
    const point2 = ref<string>('45.38878632,6.56737927');
    const point1Alt = ref<string>('');
    const point2Alt = ref<string>('');
    const calculatedDistance = ref<number>();

    const file = ref<File | null>();
    const skiSiteDataFile = ref<File | null>();
    const form = ref<HTMLFormElement>();
    const indexedDb = inject('$indexedDb') as IndexedDb;

    function onFileChanged($event: Event) {
      const target = $event.target as HTMLInputElement;
      if (target && target.files) {
        file.value = target.files[0];
        file.value?.text().then((textResult) => {
          const gpxModule = GpxXml2JsonConverter.convertGpxXml2GpxModule(textResult);
          if (!gpxModule || !gpxModule.creationDate || !gpxModule.gpxRecord) {
            const newErr = new Error('Gpx module is invalid ');
            console.error(newErr, '\ngpxModule :', gpxModule);
            throw newErr;
          }
          const creationDate = gpxModule?.creationDate.format('YYYY_MM_DD');
          indexedDb.setGpxRecord(creationDate!, gpxModule?.gpxRecord!.toJSON());
        });
      }
    }

    function onSkiSiteDataFileChanged($event: Event) {
      const target = $event.target as HTMLInputElement;
      if (target && target.files) {
        skiSiteDataFile.value = target.files[0];
      }

    }

    async function calculateDistance() {
      if (!point1.value || !point2.value) {
        alert('missing input' );
        return;
      }
      let tokens = point1.value.split(',');
      const point1PosRecord: PosRecord = {
        lat: Number.parseFloat(tokens[0]),
        lon: Number.parseFloat(tokens[1]),
        alt: point1Alt.value ? Number.parseFloat(point1Alt.value) : undefined
      };
      tokens = point2.value.split(',');
      const point2PosRecord: PosRecord = {
        lat: Number.parseFloat(tokens[0]),
        lon: Number.parseFloat(tokens[1]),
        alt: point2Alt.value ? Number.parseFloat(point2Alt.value) : undefined
      };
      calculatedDistance.value =
          GeoCalculations.distanceCalculationElevationNotMandatory(point1PosRecord, point2PosRecord);
    }

    return {
      point1,
      point2,
      point1Alt,
      point2Alt,
      calculatedDistance,
      file,
      onFileChanged,
      onSkiSiteDataFileChanged,
      calculateDistance
    };

  }
};
</script>

<style scoped>

</style>
