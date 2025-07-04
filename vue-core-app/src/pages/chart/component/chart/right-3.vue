<template>
  <div class="ro-right-3">
    <ChartTitle title="运力发展趋势" />
    <Chart :option="shallowOption.option" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowReactive } from "vue"

import ChartTitle from "../chart-title.vue"
import Chart from "./chart.vue"
import { right3Option } from "./options.js"
import { TmsService } from "@/service/api/TmsService"

const shallowOption = shallowReactive({ option: null })

onMounted(() => {
  TmsService.carEnergyCurrentMonthAnalysis().then((response: any) => {
    if (response?.length) {
      shallowOption.option = right3Option(response)
    }
  })
})
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-right-3 {
  height: calc(100% - 20px);
}
</style>
