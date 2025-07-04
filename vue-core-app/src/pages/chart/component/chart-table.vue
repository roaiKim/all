<template>
  <div class="ro-table ro-scrollbar-container">
    <div class="ro-table-header">
      <div v-for="column in columns" :key="column.field" :style="{ width: column.width, padding: '5px' }">
        <span>{{ column.title }}</span>
      </div>
    </div>
    <div class="ro-table-body">
      <!-- <div v-for="(source, index) in dataSource" :key="index">
        <div class="ro-text" v-for="column in columns" :key="column.field" :style="{ width: column.width, padding: '5px' }">
          {{ column.render ? column.render(source, index) : source[column.field] }}
        </div>
      </div> -->
      <div class="scroll">
        <vue3-seamless-scroll :list="dataSource || []" v-model="action" hover :singleHeight="60" :singleWaitTime="3000">
          <div class="item" v-for="(source, index) in dataSource || []" :key="index">
            <div class="ro-text" v-for="column in columns" :key="column.field" :style="{ width: column.width, padding: '5px' }">
              {{ column.render ? column.render(source, index) : source[column.field] }}
            </div>
          </div>
        </vue3-seamless-scroll>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue"
import { Vue3SeamlessScroll } from "vue3-seamless-scroll"

interface Columns {
  title: string
  field: string
  width: string
  suffix: string
  render?: (source, index) => any
}

defineProps<{ columns: Columns[]; dataSource: any[] | null }>()

const action = ref(false)

watchEffect(() => {
  setTimeout(() => {
    action.value = true
  }, 5000)
})
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-table {
  border: 1px solid #37709b;
  margin: 0px @tms-box-margin-gap;
  text-align: center;
  height: 100%;
  overflow: hidden;

  &:hover {
    // overflow: auto;
  }
  .ro-table-header {
    max-height: 100%;
    display: flex;
    color: #20b1ff;
    > div {
      background: linear-gradient(180deg, rgba(44, 96, 190, 0.4) 0%, rgba(23, 67, 144, 0.4) 100%);
      border: 1px solid rgba(84, 181, 255, 0.3);
    }
  }
  .ro-table-body {
    // overflow: hidden;
    max-height: 155px;
    height: 100%;
    // > div {
    //   display: flex;
    //   background: #0f2a51;
    //   height: 100%;

    //   &:nth-child(odd) {
    //     background: #031233;
    //   }
    // }

    .scroll {
      // height: 270px;
      // width: 500px;
      // margin: 100px auto;
      overflow: hidden;
      > div {
        width: 100%;
      }
    }

    .scroll .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 0;
      background: #0f2a51;

      &:nth-child(odd) {
        background: #031233;
      }
    }
  }
}
</style>
