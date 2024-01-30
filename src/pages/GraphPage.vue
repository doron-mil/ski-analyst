<template>
  <div class="graph-page">
    <div class="graph-page-inner">

      <button @click="displayGraph()">
        Display
      </button>

      <div>
        <apexchart ref="realtimeChart"  width="100%" height="90%" type="line" :options="options"
                   :series="dataSeries"></apexchart>
      </div>
      <div v-html="showResults">

      </div>

    </div>
  </div>
</template>

<script lang="ts">
import {nextTick, onMounted, ref} from 'vue';
import {useStore} from 'vuex';
import moment from 'moment';
import {GpxRecordInterface} from '../model/types.ts';

export default {
  name: "GraphPage",
  async setup() {
    const store = useStore();

    const graphData: GpxRecordInterface[] = ref();

    const showResults = ref();

    const options = ref({
      chart: {
        id: 'vuechart-example',
        toolbar: {
          show: false // Hiding the toolbar
        }
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
            }
            return newValue;
          }
        },
        custom: function ({series, seriesIndex, dataPointIndex, w}) {
          const titleOuterText = Number.parseInt(w.globals.tooltip.tooltipTitle.outerText);
          const timeText = graphData.value[dataPointIndex].time;
          const title = `<div class="apexcharts-tooltip-title" ` +
              `style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">` +
              `Point#: ${dataPointIndex}, ${titleOuterText} Sec , ${Number(titleOuterText / 60).toFixed(1)} Min , Time : ${timeText} `
              + `</div>`;


          // Working
          let items = "";
          w.globals.tooltip.ttItems.forEach(x => {
            items = items + x.outerHTML;
          });
          showResults.value = items;
          return title + items;

        }
      }
    });

    const yaxisTemplate = {
      show: false,
      showAlways: false,
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

    const displayGraph = (() => {

    });

    const loadData = (async () => {
      return new Promise(async (resolve) => {
        console.log('333');

        const data = await store.dispatch('skiData/retrieveGpxDataAndUpdateStateIfNeeded');

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
            const newYAxisProp = structuredClone(yaxisTemplate);
            newYAxisProp.title.text = key;
            options.value.yaxis.push(newYAxisProp);

            const yAxisData = graphData.value.map((record) => {
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
                  data: yAxisData
                });
          }
        });

        resolve();
      });
    });

    onMounted( () => {
      nextTick(() => {
        dataSeries.value.forEach((series) => {
          if (series.name !== 'speed') {
            realtimeChart.value.hideSeries(series.name);
          }
        });
      });
    });

    await loadData();

    return {
      options,
      dataSeries,
      realtimeChart,
      showResults,
      displayGraph,
    };
  }
};
</script>

<style scoped lang="scss">
.graph-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  .graph-page-inner {
    width: 100%;
    height: 100%;
    background-color: #FFF;
    //padding: 32px;
    //z-index: 99;

    DIV {
      height: 95%;
    }
  }

}
</style>
