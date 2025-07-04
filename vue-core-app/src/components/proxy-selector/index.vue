<template>
  <div className="ro-proxy">
    <a-select ref="select" v-model:value="dev_proxy_host" style="min-width: 220px" @change="handleChange">
      <a-select-option v-for="(value, key) in proxyConfig" :key="key" :value="key">{{ value }}</a-select-option>
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { DEV_PROXY_HOST } from "@/service/config/static-envs"
import { StorageService } from "@/service/StorageService"
import proxyConfig from "@/service/config/development.proxy.json"
import { ref } from "vue"

const dev_proxy_host = ref<string | null>(StorageService.get(DEV_PROXY_HOST))
const handleChange = (value: string) => {
  StorageService.set(DEV_PROXY_HOST, value)
}
console.log("--proxyConfig--", proxyConfig)
</script>

<style scoped lang="less">
.ro-proxy {
  text-align: center;
  margin-top: 20px;
}
</style>
