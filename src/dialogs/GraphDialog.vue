<template>
  <div class="graph-dialog">
    <div class="graph-dialog-inner">

      <div>
        <apexchart ref="realtimeChart" width="100%" height="90%" type="line" :options="options"
                   :series="dataSeries"></apexchart>
      </div>
      <div v-html="showResults">

      </div>
      <button @click="closeDialog()">
        Close
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {nextTick, onMounted, reactive, ref, watch} from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import ApexCharts from 'apexcharts';
import {useStore} from 'vuex';
import {getGpxData} from '../store/ski-data/getters.ts';
import moment from 'moment';
import {GpxOnePosRecord} from '../model/GpxOnePosRecord.ts';
import {GpxRecordInterface} from '../model/types.ts';

export default {
  name: "GraphDialog",
  props: ['closeDialog'],
  setup() {
    const store = useStore();

    const graphData: GpxRecordInterface[] = ref();

    const showResults = ref();

    const options = ref({
      chart: {
        id: 'vuechart-example'
      },
      xaxis: {
        type: 'numeric',
        categories: []
      },
      yaxis: [],

      stroke: {
        width: 2,
      },

      tooltip: {
        y: {
          formatter: function (value, {series, seriesIndex, dataPointIndex, w}) {
            let newValue = value;
            if (series[seriesIndex].length) {
              const seriesName = dataSeries.value[seriesIndex].name;
              if (['lat', 'lon'].includes(seriesName)) {
                newValue = graphData.value[dataPointIndex][seriesName];
              }

              // console.log('eeee', w.config.series[seriesIndex].name,dataSeries.value[seriesIndex].name);
            }
            return newValue;
          }
        },
        custom: function ({series, seriesIndex, dataPointIndex, w}) {
          // let title = w.globals.tooltip.tooltipTitle.outerHTML;
          const titleOuterText = Number.parseInt(w.globals.tooltip.tooltipTitle.outerText);
          const timeText = graphData.value[dataPointIndex].time;
          const title = `<div class="apexcharts-tooltip-title" ` +
              `style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">` +
              `Point#: ${dataPointIndex}, ${titleOuterText} Sec , ${Number(titleOuterText / 60).toFixed(1)} Min , Time : ${timeText} `
              + `</div>`;


          // console.log('wwwww', w.globals.tooltip);
          // Working
          let items = "";
          w.globals.tooltip.ttItems.forEach(x => {
            // const doc = new DOMParser().parseFromString(ht, "text/xml");
            // const doc = new DOMParser(x);
            // console.log('wwwww','\n\n', doc.documentElement.outerHTML,'\n\n',x.outerHTML);

            // if (!x.getAttribute('style').includes('none')) {
            //   console.log('wwwww', '\n\n', x.getAttribute('style'),
            //       x.getElementsByClassName("apexcharts-tooltip-text-y-label")[0].outerText
            //   );
            //   if (x.getElementsByClassName("apexcharts-tooltip-text-y-label")[0].outerText.includes('lat')) {
            //     if (x.getElementsByClassName("apexcharts-tooltip-text-y-value").length) {
            //       // console.log('w3', x.getElementsByClassName("apexcharts-tooltip-text-y-value")[0].innerText);
            //       x.getElementsByClassName("apexcharts-tooltip-text-y-value")[0].innerText = 'aaa';
            //     } else {
            //       console.log('w2', x.outerHTML);
            //     }
            //   }

            // items = items + ht;
            // items = items + doc.documentElement.outerHTML;
            // items = items + x.outerHTML;
            // }
            items = items + x.outerHTML;
          });
          showResults.value = items;
          // console.log('wwwww1', items);
          // console.log('wwwww1', w.globals.tooltip);
          return title + items;

          // console.log('qqqq',seriesIndex,w);
          // return '<div class="arrow_box">' +
          //     '<span>' + 'aaa' + seriesIndex + 'bbbb' + graphData.value[dataPointIndex].x + 'ccccc' + series[seriesIndex][dataPointIndex] + '</span>' +
          //     '</div>';
        }
      }
    });

    const yaxisTemplate = {
      show: true,
      decimalsInFloat: 2,
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
        text: "",
        style: {
          color: "#FF1654"
        }
      }
    };

    const dataSeries = ref(
        []
    );

    const realtimeChart = ref();

    onMounted(() => {
      const data = store.getters['skiData/getGpxData'];

      graphData.value = data.slice(0, 100);

      Object.keys(data[1]).forEach((key) => {
        if (key === 'time') {
          let firstX;
          options.value.xaxis.categories = graphData.value.map((record, index) => {
            if (index === 0) {
              firstX = moment(`2013-02-08 ${record.time}`).valueOf();
            }
            return (moment(`2013-02-08 ${record.time}`).valueOf() - firstX) / 1000;
          });

        } else {
          const newYAxisProp = structuredClone( yaxisTemplate);
          newYAxisProp.title.text = key;
          options.value.yaxis.push(newYAxisProp);

          const data = graphData.value.map((record) => {
            let recordAttr = record[key] ?? 0;
            switch (key) {
              case 'lat':
              case 'lon':
                recordAttr = Math.trunc((recordAttr - Math.trunc(recordAttr)) * 10000);
                break;
              case 'dist':
              case 'distE':
              case 'speed':
                recordAttr = Number(recordAttr).toFixed(2);
                break;
              case 'alt':
              case 'dEle':
                recordAttr = Number(recordAttr).toFixed(1);
                break;
            }

            return recordAttr;
          });

          dataSeries.value.push(
              {
                name: key,
                data
              });
        }
      });

      // console.log('1111', series.value);
      // graphData.value = data.slice(0, 100).map((record: GpxOnePosRecord) =>
      //     ({x: record.time, y: record.dist ??= 0, y2: record.distE ??= 0}));
      //
      // let firstX;
      // options.value.xaxis.categories = graphData.value.map((record, index) => {
      //   if (!index) {
      //     firstX = moment(`2013-02-08 ${record.x}`).valueOf();
      //   }
      //   return (moment(`2013-02-08 ${record.x}`).valueOf() - firstX) / 1000;
      // });
      // series.value[0].data = graphData.value.map((record) => (record.y));
      // series.value[1].data = graphData.value.map((record) => (record.y2));


      //
      // const d1 = dataMan1.map((record) => moment(`2013-02-08 ${record.x}` ))
      // console.log('1111', d1);
      // console.log('1111', series.value[0].data);

      nextTick(() => {
        dataSeries.value.forEach((series) => {
          if (series.name !== 'speed') {
            realtimeChart.value.hideSeries(series.name);
          }
        });
      });


    });

    return {
      options,
      dataSeries,
      realtimeChart,
      showResults,
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

    DIV {
      height: 95%;
    }
  }

}
</style>
