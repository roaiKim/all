<template>
  <div class="ro-charts-container" :style="height ? { height } : {}">
    <div ref="echartsDomRef"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, markRaw } from "vue"
import * as echarts from "echarts"
import { useElementResizeObserver } from "../utils/index.js"

const props = defineProps<{
  option: any
  height?: number | string
  mapClick?: (params) => void
}>()

const echartsDomRef = ref(null)
const echartsInstanceRef = ref(null)

const domSize = useElementResizeObserver(echartsDomRef, 200)

onMounted(() => {
  const chartDom = echartsDomRef.value
  // markRaw 转化成 非响应式
  const myChart = markRaw(echarts.init(chartDom))
  echartsInstanceRef.value = myChart
  if (props.mapClick) {
    myChart.on("click", props.mapClick)
  }
})

watch(
  () => props.option,
  () => {
    if (props.option && echartsInstanceRef.value) {
      echartsInstanceRef.value.setOption(props.option)
    }
  },
)

watch([echartsInstanceRef, () => domSize.domWidth, () => domSize.domHeight], () => {
  if (echartsInstanceRef.value) {
    echartsInstanceRef.value.resize()
  }
})
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-charts-container {
  height: calc(100% - 30px);
  > div {
    width: 100%;
    height: 100%;
  }
}
</style>
