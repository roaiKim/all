<template>
  <div class="ro-tms-container">
    <Header></Header>
    <div class="ro-tms-body">
      <div class="ro-body-left-container">
        <div class="ro-left-box">
          <Left1 />
        </div>
        <div class="ro-left-box">
          <Left2 />
        </div>
        <div class="ro-left-box">
          <Left3 />
        </div>
      </div>
      <div class="ro-body-center-container">
        <div class="ro-center-box">
          <Center1 />
        </div>
        <div class="ro-center-box">
          <Center2 />
        </div>
        <div class="ro-center-box">
          <Center3 />
        </div>
      </div>
      <div class="ro-body-right-container">
        <div class="ro-right-box">
          <Right1 />
        </div>
        <div class="ro-right-box">
          <Right2 />
        </div>
        <div class="ro-right-box">
          <Right3 />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "./component/chart-head.vue"
import Left1 from "./component/chart/left-1.vue"
import Left2 from "./component/chart/left-2.vue"
import Left3 from "./component/chart/left-3.vue"
import Right3 from "./component/chart/right-3.vue"
import Center3 from "./component/chart/center-3.vue"
import Right1 from "./component/chart/right-1.vue"
import Right2 from "./component/chart/right-2.vue"
import Center2 from "./component/chart/center-2.vue"
import Center1 from "./component/chart/center-1.vue"
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-tms-container {
  height: 100vh;
  color: #fff;
}

.ro-tms-body {
  display: flex;
  min-height: calc(100vh - @tms-header-height - @tms-container-bottom-gap - @tms-container-top-gap);
  padding: @tms-container-top-gap @tms-container-horizontal-gap @tms-container-bottom-gap @tms-container-horizontal-gap;
  background-color: @main-background-color;
}

.ro-body-left-container,
.ro-body-right-container {
  //   flex-grow: 2;
  display: flex;
  flex-direction: column;
  width: 30%;

  .ro-left-box,
  .ro-right-box {
    width: 100%;
    background: rgba(255, 255, 255, 0);
    box-shadow: inset 0px 1px 182px 0px rgba(84, 181, 255, 0.3);
    border: 1px solid rgba(84, 181, 255, 0.5);

    &:nth-child(1) {
      //   flex-grow: 4;
      height: 40%;
    }

    &:nth-child(2) {
      //   flex-grow: 3;
      margin-top: @tms-box-gap;
      height: 30%;
    }

    &:nth-child(3) {
      //   flex-grow: 3;
      margin-top: @tms-box-gap;
      height: 30%;
    }
  }
}

.ro-body-center-container {
  //   flex-grow: 3;
  display: flex;
  flex-direction: column;
  padding: 0 @tms-box-gap;
  width: 40%;

  .ro-center-box {
    &:nth-child(1) {
      //   flex-grow: 12;
      height: 60%;
    }

    &:nth-child(2) {
      //   flex-grow: 2;
      height: 10%;
      margin-top: @tms-box-gap;
      box-shadow: inset 0px 1px 165px 0px rgba(84, 181, 255, 0.3);
      border: 1px solid rgba(84, 181, 255, 0.5);
    }

    &:nth-child(3) {
      //   flex-grow: 6;
      height: 30%;
      margin-top: @tms-box-gap;
      width: 100%;
      background: rgba(255, 255, 255, 0);
      box-shadow: inset 0px 1px 182px 0px rgba(84, 181, 255, 0.3);
      border: 1px solid rgba(84, 181, 255, 0.5);
    }
  }
}
</style>
