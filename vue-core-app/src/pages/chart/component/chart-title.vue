<template>
  <div class="ro-title">
    <span>{{ props.title }}</span>
    <img class="" alt="logo" :src="boxTitle" />
  </div>
</template>

<script setup lang="ts">
import boxTitle from "@/assets/images/tms/image_title.png"
const props = defineProps<{ title: string }>()
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-title {
  height: @tms-box-title-height;
  margin: @tms-box-title-paddingTop 0px @tms-box-title-paddingTop 10px;
  position: relative;
  img {
    max-height: 100%;
  }
  span {
    font-size: 18px;
    color: #fff;
    position: absolute;
    margin-left: 20px;
  }
}
</style>
