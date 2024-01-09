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

    const graphData: { x: number, y: number, y2: number }[] = ref();

    const options = ref({
      chart: {
        id: 'vuechart-example'
      },
      xaxis: {
        type: 'numeric',
        categories: []
      },
      yaxis: [
        {
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#FF1654"
          },
          labels: {
            style: {
              colors: "#FF1654"
            }
          },
          title: {
            text: "Series A",
            style: {
              color: "#FF1654"
            }
          }
        },
        {
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#247BA0"
          },
          labels: {
            style: {
              colors: "#247BA0"
            }
          },
          title: {
            text: "Series B",
            style: {
              color: "#247BA0"
            }
          }
        }
      ],

      tooltip: {
        custom: function ({series, seriesIndex, dataPointIndex, w}) {
          // let title = w.globals.tooltip.tooltipTitle.outerHTML;
          const titleOuterText = Number.parseInt(w.globals.tooltip.tooltipTitle.outerText);
          const timeText = graphData.value[dataPointIndex].x;
          const title = `<div class="apexcharts-tooltip-title" ` +
              `style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">` +
              `Point#: ${dataPointIndex}, ${titleOuterText} Sec , Time : ${timeText} `
              + `</div>`;


          // console.log('wwwww', title);
          let items = "";
          w.globals.tooltip.ttItems.forEach(x => {
            items = items + x.outerHTML;
          });
          // console.log('wwwww1', items);
          console.log('wwwww1', w.globals.tooltip);
          return title + items;

          // console.log('qqqq',seriesIndex,w);
          // return '<div class="arrow_box">' +
          //     '<span>' + 'aaa' + seriesIndex + 'bbbb' + graphData.value[dataPointIndex].x + 'ccccc' + series[seriesIndex][dataPointIndex] + '</span>' +
          //     '</div>';
        }
      }
    });

    const series = ref(
        [{
          name: 'series-1',
          data: []
        }, {
          name: 'series-2',
          data: []
        }]
    );

    onMounted(() => {
      const data = store.getters['skiData/getGpxData'];

      graphData.value = data.slice(0, 100).map((record: GpxOnePosRecord) =>
          ({x: record.time, y: record.dist ??= 0, y2: record.distE ??= 0}));

      let firstX;
      options.value.xaxis.categories = graphData.value.map((record, index) => {
        if (!index) {
          firstX = moment(`2013-02-08 ${record.x}`).valueOf();
        }
        return (moment(`2013-02-08 ${record.x}`).valueOf() - firstX) / 1000;
      });
      series.value[0].data = graphData.value.map((record) => (record.y));
      series.value[1].data = graphData.value.map((record) => (record.y2));
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
