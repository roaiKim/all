<template>
  <div class="ro-body-container">
    <HeaderComponent />
    <div className="ro-main-body">
      <div class="ro-meuns-container">
        <a-menu id="dddddd" style="width: 256px" mode="inline" :items="mainState.state.navPermission" @click="handleClick"></a-menu>
      </div>
      <main class="ro-module-body"></main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { actions, type MainGolbalState } from "../index"
import HeaderComponent from "@/pages/common/header/component/index.vue"
import router from "@/router"
import type { ActionStore } from "@/type"
import { getPower } from "@/utils"
import { AuthService } from "@/pages/home/index.module"

const mainState: ActionStore<MainGolbalState> = actions.store()

const handleClick = (info) => {
  console.log("---", info)
}

const hasPower = getPower(AuthService.addition)

console.log("--actions.store--sss")

const route = useRoute()
actions.fetchPermission(() => {
  // 如果在 登录页 需要需要跳转到首页
  if (route.path === "/login") {
    router.push("/")
  }
})
</script>

<style scoped lang="less">
.ro-main-body {
  height: calc(100vh - 46px);
  display: flex;

  > main {
    flex-grow: 1;
    background-color: #f0f2f5;
    border-radius: 5px;
    padding: 5px 5px 0;
  }

  .ro-meuns-container {
    overflow-y: scroll;
    overflow-x: hidden;
    min-width: 80px;
    max-height: 100%;
    background: #fff;

    &::-webkit-scrollbar {
      width: 0;
    }
  }
}

.ro-module-body {
  overflow: hidden;

  > div[class*="-container-module"] {
    height: 100%;
    display: none;
    background: #fff;

    &.active-module {
      display: block;
      overflow-y: auto;
    }

    > div {
      height: 100%;
      overflow: auto;
    }
  }
}

.ro-permission-error-mask {
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  text-align: center;
}
</style>
