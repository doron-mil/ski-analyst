<template>
  <div class="graph-page">
    <div class="graph-page-inner">

      <div class="top-section">
        <v-select
            v-model="displayCount"
            class="display-count-select"
            density="compact" variant="outlined" rounded="true"
            :items="['50','100','200','500','1000','all']"
        >

        </v-select>

        <button @click="displayGraph()">
          Display
        </button>
        <v-pagination
            v-model="currentPage"
            @update:modelValue="onPageChange"
            :length="maxPages"
            :total-visible="5"
            :show-first-last-page="true"
        ></v-pagination>
      </div>

      <div class="graph-section">
        <apexchart ref="realtimeChart" width="100%" height="90%" type="line" :options="options"
                   :series="dataSeries"></apexchart>
      </div>
      <div v-html="showResults">

      </div>

    </div>
  </div>
</template>

<script lang="ts">
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import {useStore} from 'vuex';
import moment from 'moment';
import {GpxRecordInterface} from '../model/types.ts';

export default {
  name: "GraphPage",
  async setup() {
    const store = useStore();

    const allGraphData: GpxRecordInterface[] = ref();
    const graphData: GpxRecordInterface[] = ref();

    const displayCount = ref('100');
    const currentPage = ref(1);

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
          const graphDataRecord = graphData.value[dataPointIndex];
          const timeText = graphDataRecord.time;
          const originalIndex = graphDataRecord.originalIndex;
          const title = `<div class="apexcharts-tooltip-title" ` +
              `style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">` +
              `Point#: ${originalIndex}, ${titleOuterText} Sec , ${Number(titleOuterText / 60).toFixed(1)} Min , Time : ${timeText} `
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
      console.log('111222', currentPage.value, displayCount.value);
    });

    const loadData = (async () => {
      return new Promise(async (resolve) => {

        allGraphData.value = await store.dispatch('skiData/retrieveGpxDataAndUpdateStateIfNeeded');

        loadSlicedData();
        resolve();
      });

    });

    const loadSlicedData = (() => {
      let dataStart = 0;
      const isDisplayAll = (displayCount.value === 'all');
      const displayCountInt = isDisplayAll ? 0 : Number.parseInt(displayCount.value);
      if (isDisplayAll) {
        graphData.value = allGraphData.value;
      } else {
        dataStart = (currentPage.value - 1) * displayCountInt;
        graphData.value = allGraphData.value.slice(dataStart, dataStart + displayCountInt);
      }

      graphData.value.forEach((record, index) => {
        record.originalIndex = dataStart + index;
      });

      options.value.xaxis.categories = [];
      options.value.yaxis = [];
      dataSeries.value = [];

      Object.keys(graphData.value[1]).forEach((key) => {
        if (key === 'time') {
          let firstX;
          options.value.xaxis.categories = graphData.value.map((record, index) => {
            if (index === 0) {
              firstX = moment(`2013-02-08 ${allGraphData.value[0].time}`).valueOf();
            }
            return (moment(`2013-02-08 ${record.time}`).valueOf() - firstX) / 1000;
          });

          // If last page adding categories that will have Zero value in YAxis -
          // so the graph won't seem weired on the last page
          const currentCategoriesCount = options.value.xaxis.categories.length;
          let missingCategoryCount;

          if (displayCountInt &&
              (missingCategoryCount = (displayCountInt - currentCategoriesCount)) > 0) {
            const lastTime = options.value.xaxis.categories[currentCategoriesCount - 1];
            for (let i = 0; i < missingCategoryCount; i++) {
              options.value.xaxis.categories.push(lastTime + (i + 1) * 4);
            }
          }

        } else if (key !== 'originalIndex') {
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

    });

    const hideNotDisplaySeries = (() => {
      nextTick(() => {
        dataSeries.value.forEach((series) => {
          if (series.name !== 'speed') {
            realtimeChart.value.hideSeries(series.name);
          }
        });
      });

    });

    onMounted(() => {
      hideNotDisplaySeries();
    });

    await loadData();

    const maxPages = computed(() => {
      let maxPagesVar = 1;
      if (allGraphData.value?.length) {
        const displayCountInt = (displayCount.value === 'all') ? allGraphData.value.length :
            Number.parseInt(displayCount.value);
        console.log('11111', displayCountInt, (displayCountInt ?? allGraphData.value.length));
        maxPagesVar = Math.ceil(allGraphData.value.length / displayCountInt);
      }
      return maxPagesVar;
    });

    const modifyData = (() => {
      loadSlicedData();
      realtimeChart.value.updateOptions(options.value);
      realtimeChart.value.updateSeries(dataSeries.value);
      hideNotDisplaySeries();

    });

    const onPageChange = (aa) => {
      modifyData();
    };

    watch(displayCount, (newValue, oldValue) => {
      modifyData();
    });

    return {
      options,
      dataSeries,
      realtimeChart,
      showResults,
      allGraphData,
      maxPages,
      displayCount,
      displayGraph,
      currentPage,
      onPageChange,
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
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 10% 90%;
    grid-template-areas:
      "header"
      "main";

    .top-section {
      grid-area: header;
      display: flex;
      flex-direction: row-reverse;

      //:deep(.v-text-field--box .v-input__slot, .v-text-field--outline .v-input__slot) {
      //  max-height: 30px !important;
      //}
      .display-count-select {
        max-width: 12vw;
        max-height: 1vh;


        :deep(.v-field ) {
          font-size: 14px;
        }

      }

      .v-input--density-compact {
        --v-input-padding-top: unset;
      }

    }

    .graph-section {
      grid-area: main;
    }

  }

}
</style>
