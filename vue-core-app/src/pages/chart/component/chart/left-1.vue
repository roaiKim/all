<template>
  <div class="ro-left-1">
    <ChartTitle title="货主赋能" />
    <div class="ro-total-box">
      <div class="ro-box">
        <div class="ro-box-title">总订单数</div>
        <div class="ro-box-value">{{ orderAnalysis.totalCount }}</div>
      </div>
      <div class="ro-box">
        <div class="ro-box-title">重量KG</div>
        <div class="ro-box-value">{{ orderAnalysis.totalWeight }}</div>
      </div>
      <div class="ro-box">
        <div class="ro-box-title">体积m³</div>
        <div class="ro-box-value">{{ orderAnalysis.totalVolume }}</div>
      </div>
      <div class="ro-box">
        <div class="ro-box-title">件数</div>
        <div class="ro-box-value">{{ orderAnalysis.totalQuantity }}</div>
      </div>
    </div>
    <ChartTitle title="TOP10货主" />
    <div class="ro-table-container">
      <ChartTable :columns="columns" :dataSource="topClientAnalysis" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChartTitle from "../chart-title.vue"
import ChartTable from "../chart-table.vue"
import { onMounted, ref } from "vue"
import { TmsService } from "@/service/api/TmsService"

const orderAnalysis = ref({
  totalCount: 0,
  totalQuantity: 0,
  totalVolume: 0,
  totalWeight: 0,
})

const topClientAnalysis = ref(null)

onMounted(() => {
  TmsService.orderAnalysis().then((response: any) => {
    if (response) {
      orderAnalysis.value.totalCount = response.totalCount || 0
      orderAnalysis.value.totalQuantity = response.totalQuantity || 0
      orderAnalysis.value.totalVolume = response.totalVolume || 0
      orderAnalysis.value.totalWeight = response.totalWeight || 0
    }
  })
  TmsService.topClientAnalysis().then((response: any) => {
    if (response?.length) {
      topClientAnalysis.value = response
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
    title: "客户名称",
    field: "clientName",
    width: "22.5%",
    suffix: "",
  },
  {
    title: "重量KG",
    field: "totalWeight",
    width: "22.5%",
    suffix: "",
  },
  {
    title: "体积m³",
    field: "totalVolume",
    width: "22.5%",
    suffix: "",
  },
  {
    title: "件数",
    field: "totalQuantity",
    width: "22.5%",
    suffix: "",
  },
]
// const dataSource = [
//   {
//     clientName: "客户名称1",
//     weight: 1000,
//     volume: 200,
//     quantity: 53669,
//   },
//   {
//     clientName: "客户名称2",
//     weight: 869,
//     volume: 187,
//     quantity: 48907,
//   },
//   {
//     clientName: "客户名称3",
//     weight: 763,
//     volume: 156,
//     quantity: 39630,
//   },
//   {
//     clientName: "客户名称466",
//     weight: 634,
//     volume: 132,
//     quantity: 30265,
//   },
//   {
//     clientName: "客户名称5",
//     weight: 528,
//     volume: 97,
//     quantity: 20349,
//   },
// ]
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-left-1 {
  height: 100%;
  .ro-total-box {
    display: flex;
    justify-content: space-around;
    text-align: center;
    .ro-box {
      width: 20%;
      // flex-grow: 1;
    }
    .ro-box-title {
      background: linear-gradient(90deg, #001527 0%, #0a4d8a 47%, #0a4e8c 47%, #001527 100%);
      position: relative;

      &::after,
      &::before {
        content: " ";
        background: linear-gradient(90deg, #21eaf7 0%, #0078ec 100%, #0078ec 100%);
        box-shadow: 0px 0px 8px 0px #158aa8;
        top: 0;
        right: 0;
        position: absolute;
        width: 8px;
        height: 16px;
      }

      &::before {
        left: 0;
      }
    }
    .ro-box-value {
      background: #01172c;
      border: 1px solid;
      border-image: linear-gradient(360deg, rgba(0, 120, 236, 1), rgba(0, 120, 236, 1), rgba(0, 63, 124, 1)) 1 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
    }
  }
  .ro-table-container {
    height: calc(100% - @tms-box-margin-gap - @tms-box-margin-gap - @tms-box-margin-gap - @tms-box-margin-gap - 140px);
  }
}
</style>
