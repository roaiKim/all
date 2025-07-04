<template>
  <div>
    <img style="height: 100%" :src="todayStatistics" alt="statistics" />
    <div class="ro-statistics-value">
      <div style="font-size: 14px">{{ title }}</div>
      <div ref="domRef" id="domRef" style="font-size: 28px; font-weight: bold">
        <count-up :start-val="0" :end-val="showTotal" :duration="4" separator="" :autoplay="true" :options="{ separator: '' }"></count-up>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import todayStatistics from "@/assets/images/tms/today-statistics.png"
import { ref, watch } from "vue"
import countUp from "vue-countup-v3"
const props = defineProps<{ title: string; value: number | null }>()
const showTotal = ref(props.value)
const domRef = ref(null)

let timer = null

watch(
  () => props.value,
  () => {
    showTotal.value = props.value // - 5 < 0 ? 0 : props.value - 5
  },
  // { once: true },
)

// watch(
//   () => showTotal.value,
//   () => {
//     const inter = Math.floor(Math.random()) + 2
//     timer = setTimeout(() => {
//       showTotal.value = props.value
//     }, inter * 1000)
//   },
//   { once: true },
// )
</script>

<style scoped lang="less">
.ro-statistics-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
