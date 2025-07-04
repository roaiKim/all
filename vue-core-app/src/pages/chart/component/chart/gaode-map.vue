<template>
  <div class="ro-gaode-map-container">
    <button @click="onMapBack">返回</button>
    <Header></Header>
    <div class="ro-map-container" ref="mapDomRef"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, markRaw, onMounted, onUnmounted, ref } from "vue"
import AMapLoader from "@amap/amap-jsapi-loader"
import Header from "..//chart-head.vue"

const props = defineProps<{
  onMapBack: () => void
  proivanceName: string
  getMapInstance?: (mapContext, Amap) => void
  mapLoadedAction?: () => void
}>()

const mapDomRef = ref(null)
const mapInstanceRef = ref(null)

onMounted(() => {
  const chartDom = mapDomRef.value
  // markRaw 转化成 非响应式
  AMapLoader.load({
    key: "db872e6423a0347b49a4f33825dbca50",
    version: "2.0",
    plugins: ["AMap.Scale", "AMap.DistrictSearch"],
  }).then((AMap) => {
    const map = new AMap.Map(chartDom, {
      // viewMode: "3D", // 是否为3D地图模式
      zoom: 11, // 初始化地图级别
      center: [116.397428, 39.90923], // 初始化地图中心点位置
    })
    map.setMapStyle("amap://styles/dark")
    const myMap = markRaw(map)
    mapInstanceRef.value = myMap
    if (props.getMapInstance) {
      props.getMapInstance(mapInstanceRef.value, AMap)
    }
  })
})

onUnmounted(() => {
  console.log("---map-onUnmounted---")
})
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-gaode-map-container {
  position: fixed;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #141415;
  z-index: 999;

  > button {
    width: 80px;
    height: 35px;
    background: #3579ff;
    border-radius: 5px;
    border: 1px solid #3291f8;
    outline: none;
    cursor: pointer;
    color: #fff;
    position: absolute;
    top: 100px;
    left: 20px;
    z-index: 99999;
  }
  .ro-map-container {
    width: 100%;
    height: 100%;
  }
}
</style>
