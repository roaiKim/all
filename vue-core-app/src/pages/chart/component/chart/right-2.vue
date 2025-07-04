<template>
  <div class="ro-right-3">
    <ChartTitle title="车型/能源类型" />
    <div class="ro-chart-box">
      <Chart :option="shallowOption.option1" />
      <Chart :option="shallowOption.option2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowReactive } from "vue"

import ChartTitle from "../chart-title.vue"
import Chart from "./chart.vue"
import { right2Option1, right2Option2 } from "./options.js"
import { TmsService } from "@/service/api/TmsService"

const shallowOption = shallowReactive({ option1: null, option2: null })

onMounted(() => {
  TmsService.carClassificationAnalysis().then((response: any) => {
    if (response?.length) {
      shallowOption.option1 = right2Option1(response)
    }
  })
  TmsService.carEnergyAnalysis().then((response: any) => {
    if (response?.length) {
      shallowOption.option2 = right2Option2(response)
    }
  })
})
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-right-3 {
  height: calc(100% - 10px);
  > .ro-chart-box {
    height: calc(100% - 30px);
    display: flex;
    > div {
      height: calc(100% - 10px);
      width: 50%;
    }
  }
}
</style>
