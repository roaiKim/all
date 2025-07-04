<template>
  <div class="ro-left-2">
    <ChartTitle title="订单分布" />
    <div class="ro-table-container">
      <ChartTable :columns="columns" :dataSource="topProvinceAnalysis" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChartTitle from "../chart-title.vue"
import ChartTable from "../chart-table.vue"
import { onMounted, ref } from "vue"
import { TmsService } from "@/service/api/TmsService"

const topProvinceAnalysis = ref(null)

onMounted(() => {
  TmsService.topProvinceAnalysis().then((response: any) => {
    if (response?.length) {
      topProvinceAnalysis.value = response
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
    title: "省份",
    field: "province",
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
//     clientName: "安徽省",
//     weight: 1000,
//     volume: 200,
//     quantity: 53669,
//   },
//   {
//     clientName: "广东省",
//     weight: 869,
//     volume: 187,
//     quantity: 48907,
//   },
//   {
//     clientName: "上海市",
//     weight: 763,
//     volume: 156,
//     quantity: 39630,
//   },
//   {
//     clientName: "浙江省",
//     weight: 634,
//     volume: 132,
//     quantity: 30265,
//   },
//   {
//     clientName: "山东省",
//     weight: 528,
//     volume: 97,
//     quantity: 20349,
//   },
// ]
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-left-2 {
  height: calc(100% - 20px);
  .ro-table-container {
    height: calc(100% - @tms-box-margin-gap - 30px);
  }
}
</style>
