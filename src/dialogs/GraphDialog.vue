<template>
  <div class="graph-dialog">
    <div class="graph-dialog-inner">

      <div>
        <apexchart width="700" type="line" :options="options" :series="series"></apexchart>
      </div>

      <button @click="closeDialog()">
        Close
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {ref} from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: "GraphDialog",
  props: ['closeDialog'],
  setup() {
    const options = ref({
      chart: {
        id: 'vuechart-example'
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
      }
    });

    const series = ref(
        [{
          name: 'series-1',
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }]
    );
    return {
      options,
      series
    };
  }
};
</script>

<style scoped lang="scss">
.graph-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;
  justify-content: center;

  .graph-dialog-inner {
    width: 90%;
    height: 90%;
    background-color: #FFF;
    padding: 32px;
  }

}
</style>
