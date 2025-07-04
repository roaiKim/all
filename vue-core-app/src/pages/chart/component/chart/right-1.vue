<template>
  <div class="ro-right-1">
    <ChartTitle title="运力链接" />
    <div class="ro-total-box">
      <img class="ro-statistics" :src="statistics" alt="statistics" />
      <div class="ro-total-car">
        <div class="ro-statistics-name">总注册车辆</div>
        <div class="ro-statistics-value">{{ capacityAnalysis.totalCar }}</div>
      </div>
      <div class="ro-total-order">
        <div class="ro-statistics-value">{{ capacityAnalysis.totalStowage }}</div>
        <div class="ro-statistics-name">总运单</div>
      </div>
      <div class="ro-total-driver">
        <div class="ro-statistics-name">总注册司机</div>
        <div class="ro-statistics-value">{{ capacityAnalysis.totalDriver }}</div>
      </div>
    </div>
    <ChartTitle title="TOP10承运商" />
    <div class="ro-table-container">
      <ChartTable :columns="columns" :dataSource="topCarrierAnalysis" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChartTitle from "../chart-title.vue"
import ChartTable from "../chart-table.vue"
import statistics from "@/assets/images/tms/tongji.png"
import { onMounted, ref } from "vue"
import { TmsService } from "@/service/api/TmsService"

const capacityAnalysis = ref({
  totalCar: 0,
  totalDriver: 0,
  totalStowage: 0,
})

const topCarrierAnalysis = ref(null)

onMounted(() => {
  TmsService.capacityAnalysis().then((response: any) => {
    if (response) {
      capacityAnalysis.value.totalCar = response.totalCar || 0
      capacityAnalysis.value.totalDriver = response.totalDriver || 0
      capacityAnalysis.value.totalStowage = response.totalStowage || 0
    }
  })
  TmsService.topCarrierAnalysis().then((response: any) => {
    if (response?.length) {
      topCarrierAnalysis.value = response
    }
  })
})

const columns = [
  {
    title: "排名",
    field: "order",
    width: "10%",
    suffix: "",
    render: (source, index) => {
      return index + 1
    },
  },
  {
    title: "承运商",
    field: "carrierName",
    width: "50%",
    suffix: "",
  },
  {
    title: "车辆",
    field: "totalCar",
    width: "20%",
    suffix: "",
  },
  {
    title: "承运货量",
    field: "totalWeight",
    width: "20%",
    suffix: "",
  },
]
// const dataSource = [
//   {
//     carrierName: "运力承运商有限公司1",
//     carQuantity: 1000,
//     quantity: 53669,
//   },
//   {
//     carrierName: "运力承运商有限公司2",
//     carQuantity: 869,
//     quantity: 48907,
//   },
//   {
//     carrierName: "运力承运商有限公司3",
//     carQuantity: 763,
//     volume: 156,
//     quantity: 39630,
//   },
//   {
//     carrierName: "运力承运商有限公司466",
//     carQuantity: 634,
//     quantity: 30265,
//   },
//   {
//     carrierName: "运力承运商有限公司5",
//     carQuantity: 528,
//     quantity: 20349,
//   },
// ]
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-right-1 {
  height: 100%;
  .ro-total-box {
    height: 80px;
    position: relative;

    .ro-statistics {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .ro-total-car {
      position: absolute;
      top: 50%;
      left: 18%;
      transform: translateY(-50%);
    }
    .ro-total-order {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
    .ro-total-driver {
      position: absolute;
      top: 50%;
      right: 18%;
      transform: translateY(-50%);
    }
    .ro-total-car,
    .ro-total-order,
    .ro-total-driver {
      .ro-statistics-name {
        font-size: 14px;
      }
      .ro-statistics-value {
        font-size: 20px;
      }
    }
  }
  .ro-table-container {
    height: calc(100% - @tms-box-margin-gap - @tms-box-margin-gap - @tms-box-margin-gap - @tms-box-margin-gap - 152px);
  }
}
</style>
