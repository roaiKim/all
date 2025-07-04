<template>
  <div class="ro-center-2">
    <div class="ro-highway-container" v-for="(item, key, index) in carAnalysis" :key="index">
      <img class="ro-statistics-highway" :src="highway" alt="statistics" />
      <div style="margin-left: 0px">
        <div style="font-size: 14px">
          <span class="ro-text">{{ item.value }}</span>
          <span style="font-size: 12px">{{ item.unit }}</span>
        </div>
        <div style="font-size: 14px; margin-top: 2px" class="ro-text">
          {{ item.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import highway from "@/assets/images/tms/highway.png"
import { onMounted, ref } from "vue"
import { TmsService } from "@/service/api/TmsService"

const carAnalysis = ref({
  totalKilometer: {
    value: 0,
    unit: "KM",
    description: "总公里数",
  },
  totalPowerConsumption: {
    value: 0,
    unit: "度",
    description: "总耗电",
  },
  totalOilConsumption: {
    value: 0,
    unit: "升",
    description: "总油耗",
  },
  carbonEmissions: {
    value: 0,
    unit: "吨",
    description: "碳排放",
  },
})

onMounted(() => {
  TmsService.carAnalysis().then((response: any) => {
    if (response) {
      carAnalysis.value.carbonEmissions.value = response.carbonEmissions || 0
      carAnalysis.value.totalKilometer.value = response.totalKilometer || 0
      carAnalysis.value.totalOilConsumption.value = response.totalOilConsumption || 0
      carAnalysis.value.totalPowerConsumption.value = response.totalPowerConsumption || 0
    }
  })
})
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-center-2 {
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  .ro-highway-container {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    flex-shrink: 0;
    .ro-statistics-highway {
      height: 45%;
    }
  }
}
</style>
