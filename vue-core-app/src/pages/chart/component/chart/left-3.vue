<template>
  <div class="ro-left-3">
    <ChartTitle title="用户数量" />
    <Chart :option="shallowOption.option" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowReactive } from "vue"

import ChartTitle from "../chart-title.vue"
import Chart from "./chart.vue"
import { left3Option } from "./options.js"
import { TmsService } from "@/service/api/TmsService"

const shallowOption = shallowReactive({ option: null })

onMounted(() => {
  TmsService.userAnalysis().then((response: any) => {
    if (response?.length) {
      shallowOption.option = left3Option(response)
    }
  })
})
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-left-3 {
  height: calc(100% - 20px);
}
</style>
