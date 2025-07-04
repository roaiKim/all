<template>
  <div className="ro-login-module">
    <div className="ro-logo"></div>
    <div className="ro-login-container">
      <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish">
        <a-form-item label="账号" name="username" :rules="[{ required: true, message: '请输入账号' }]">
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
          <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
    <ProxySelector v-if="isDevelopment" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import ProxySelector from "@/components/proxy-selector/index.vue"
import { isDevelopment, LOGIN_REMEMBER_PASSWORD, LOGIN_REMEMBER_USERNAME, WEB_ISLOGIN } from "@/service/config/static-envs"
import { StorageService } from "@/service/StorageService"
import { decrypted, encrypted } from "@/utils/crypto"
import { useRoute, useRouter } from "vue-router"
import { actions as LoginAction } from "@/pages/common/login/index"
import { actions } from "@/pages/common/main/index"

// import router from "@/router"

// const route = useRoute()
// actions.fetchPermission(() => {
//   // 如果在 登录页 需要需要跳转到首页
//   if (route.path === "/login") {
//     router.push("/")
//   }
// })

const isLogined = StorageService.get(WEB_ISLOGIN)
const router = useRouter()
const route = useRoute()
if (isLogined) {
  actions.fetchPermission(() => {
    // 如果在 登录页 需要需要跳转到首页
    if (route.path === "/login") {
      router.push("/")
    }
  })
}

interface FormState {
  username: string
  password: string
  remember: boolean
}

const userName = StorageService.get<string>(encrypted(LOGIN_REMEMBER_USERNAME))
const password = StorageService.get<string>(encrypted(LOGIN_REMEMBER_PASSWORD))
const un = decrypted(userName || "")
const pw = decrypted(password || "")

const formState = reactive<FormState>({
  username: un,
  password: pw,
  remember: true,
})

const onFinish = () => {
  LoginAction.login(formState.username, formState.password)
}
</script>

<style scoped lang="less">
.ro-login-module {
  background-color: #fff;
  height: 100%;

  .ro-logo {
    text-align: center;
    padding-top: 160px;

    img {
      height: 30px;
    }
  }

  .ro-login-container {
    display: flex;
    margin-top: 60px;
    align-items: center;
    flex-direction: column;

    > form {
      width: 460px;
    }
    // input,
    button {
      height: 40px;
      width: 100%;
      flex-shrink: 0;
      border-radius: 10px;
    }

    button {
      background: #fcca00;
      color: #fff;
    }
  }
}
</style>
