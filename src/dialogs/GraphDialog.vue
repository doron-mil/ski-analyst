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
import {onMounted, ref} from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import {useStore} from 'vuex';
import {getGpxData} from '../store/ski-data/getters.ts';
import moment from 'moment';
import {GpxOnePosRecord} from '../model/GpxOnePosRecord.ts';

export default {
  name: "GraphDialog",
  props: ['closeDialog'],
  setup() {
    const store = useStore();

    const graphData : { x: number,y: number}[] = ref();

    const options = ref({
      chart: {
        id: 'vuechart-example'
      },
      xaxis: {
        type : 'numeric',
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
      },
      tooltip: {
        custom: function ({series, seriesIndex, dataPointIndex, w}) {
          return '<div class="arrow_box">' +
              '<span>' + 'aaa' + graphData.value[dataPointIndex].x + 'ccccc' + series[seriesIndex][dataPointIndex] + '</span>' +
              '</div>';
        }
      }
    });

    const series = ref(
        [{
          name: 'series-1',
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }]
    );

    onMounted(() => {
      const data = store.getters['skiData/getGpxData'];

      graphData.value = data.slice(0, 100).map((record: GpxOnePosRecord) =>
          ({x: record.time, y: record.dist ??= 0}));

      let firstX;
      options.value.xaxis.categories = graphData.value.map((record, index) => {
        if (!index) {
          firstX = moment(`2013-02-08 ${record.x}`).valueOf();
        }
        return (moment(`2013-02-08 ${record.x}`).valueOf() - firstX) / 1000;
      });
      series.value[0].data = graphData.value.map((record) => (record.y));
      //
      // const d1 = dataMan1.map((record) => moment(`2013-02-08 ${record.x}` ))
      // console.log('1111', d1);
      // console.log('1111', series.value[0].data);
    });

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
