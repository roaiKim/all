<template>
  <div class="ro-tms-header">
    <img alt="logo" :src="tmsHeader" />
  </div>
</template>

<script setup lang="ts">
import tmsHeader from "@/assets/images/tms/tms-header.png"
// const props = defineProps<{ isFixed: boolean }>()
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-tms-header {
  width: 100%;
  max-height: @tms-header-height;
  position: relative;
  // z-index: 1100;
  background-color: #000318;
  img {
    width: 100%;
    object-fit: contain;
    max-height: @tms-header-height;
  }
}
</style>
