<template>
  <header className="ro-header-module ro-flex">
    <div className="ro-header-logo ro-flex ro-col-center">
      <img alt="logo" :src="logoimg" />
      <div className="text-overflow-ellipsis">中集冷云综合服务平台</div>
    </div>
    <div className="ro-header-tabs ro-flex ro-col-center"></div>
    <div className="ro-header-operate">
      <a-dropdown trigger="click">
        <a @click.prevent class="ro-header-user">
          admin
          <DownOutlined />
        </a>
        <template #overlay>
          <a-menu class="ro-user-dropcontext" @click="handleMenuClick">
            <a-menu-item>
              <a @click.prevent>admin</a>
            </a-menu-item>
            <a-menu-item key="1">
              <div class="ro-user-dropcontext-item">
                <EditOutlined />
                <a @click.prevent
                  ><div>
                    个人资料
                    <RightOutlined /></div
                ></a>
              </div>
            </a-menu-item>
            <a-menu-item key="2">
              <div class="ro-user-dropcontext-item">
                <InfoCircleOutlined />
                <a @click.prevent><div>关于</div></a>
              </div>
            </a-menu-item>
            <a-menu-item key="3">
              <div class="ro-user-dropcontext-item">
                <InfoCircleOutlined />
                <a @click.prevent><div>开发环境</div></a>
              </div>
            </a-menu-item>
            <a-menu-item key="4">
              <div class="ro-user-dropcontext-item">
                <PoweroffOutlined />
                <a @click.prevent><div>注销</div></a>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import logoimg from "@/assets/images/global/logoimg.png"
import { DownOutlined, EditOutlined, InfoCircleOutlined, PoweroffOutlined, RightOutlined } from "@ant-design/icons-vue"
import { actions } from "@/pages/common/main"

const handleMenuClick = (event) => {
  if (event.key === "4") {
    // 退出
    actions.logoutWithConfirm()
  } else if (event.key === "3") {
    console.log(333333)
    // mainState.setState(true, navs, getPagePermission())
  }
}
</script>

<style scoped lang="less">
.ro-header-module {
  height: 46px;
  z-index: 120;
  position: relative;
  color: rgb(0 0 0 / 85%);
  line-height: 46px;
  background: #191919;
  user-select: none;

  &::after {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 3px;
    background-color: #3d3d3d;
    left: 0;
    bottom: 0;
    z-index: 99999;
  }

  .ro-header-logo {
    padding-left: 20px;
    width: 200px;
    height: 100%;
    color: #ccc;
    box-sizing: border-box;

    img {
      max-width: 80px;
      margin-right: 10px;
      max-height: 80%;
      vertical-align: middle;
    }
  }

  .ro-header-tabs {
    color: rgb(255 255 255 / 90%);
    flex-grow: 1;
  }

  .ro-header-operate {
    margin-right: 35px;
    color: #fff;
    cursor: pointer;

    .ro-header-user {
      padding: 8px;
    }
  }
}

.ro-user-dropcontext {
  .ro-user-dropcontext-item {
    display: flex !important;
    align-items: center;
    padding: 4px;
    > a {
      margin-left: 10px;
    }
  }
}

.ro-header-tab-item-g {
  width: 140px;
  height: 38px;
  perspective: 20px;
  position: relative;
  color: rgb(255 255 255 / 36%);
  font-size: 12px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 8px;
  padding-left: 20px;
  padding-right: 30px;
  transition: color 200ms;
  flex-shrink: 0;
  box-sizing: border-box;

  &.active {
    color: hsl(0deg 0% 100% / 90%);
    z-index: 9999;

    .ro-tab-trapezoid {
      background-color: #3d3d3d;
    }
  }

  &:hover {
    color: rgb(255 255 255 / 90%);
  }

  &:not(:first-child) {
    margin-left: -20px;
  }

  .ro-tab-trapezoid {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 1px;
    left: 0;
    background-color: #282828;
    border-radius: 8px 8px 0 0;
    transform: rotateX(10deg);
    transform-origin: 50% 100%;
    box-shadow: 0 0 2px 3px rgb(0 0 0 / 20%);

    &:hover {
      background-color: #2f2f2f;
    }
  }

  .ro-tab-title {
    position: relative;
    z-index: 99;
    height: 16px;
    line-height: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .anticon {
    position: absolute;
    right: 14px;
    color: rgb(255 255 255 / 50%);
    z-index: 100;
    font-size: 16px;
    height: 16px;
    width: 16px;
    margin-right: 2px;
    border-radius: 2px;

    &:hover {
      color: #9d9b9b;
      cursor: pointer;
      background-color: #646262;
    }
  }
}

.ro-header-tab-help-sort {
  z-index: 9998 !important;
}
</style>
