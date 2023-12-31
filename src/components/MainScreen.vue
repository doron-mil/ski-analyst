<template>
  <div>
    <input
        type="file"
        @change="onFileChanged($event)"
    />
  </div>
</template>

<script lang="ts">

import {GpxXml2JsonConverter} from '../Utils/GpxXml2JsonConverter';
import {ref, inject} from "vue";
import {IndexedDb} from '../Utils/IndexedDb';

export default {
  name: "MainScreen",
  setup() {
    const file = ref<File | null>();
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

    async function saveImage() {
      if (file.value) {
        try {
          // save file.value
        } catch (error) {
          console.error(error);
          form.value?.reset();
          file.value = null;
        } finally {
        }
      }
    }

    return {
      file,
      onFileChanged,
      saveImage
    };

  }
};
</script>

<style scoped>

</style>
