<template>
  <div class="ro-center-3">
    <ChartTitle title="月度货量" />
    <Chart :option="shallowOption.option" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowReactive } from "vue"

import ChartTitle from "../chart-title.vue"
import Chart from "./chart.vue"
import { center3Option } from "./options.js"
import { TmsService } from "@/service/api/TmsService"

const shallowOption = shallowReactive({ option: null })

onMounted(() => {
  TmsService.monthCargoQuantityAnalysis().then((response: any) => {
    if (response?.length) {
      shallowOption.option = center3Option(response)
    }
  })
})
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-center-3 {
  height: calc(100% - 20px);
}
</style>
