<template>
  <div class="ro-center-1">
    <div class="ro-banner" v-if="!!notices?.length">
      <!-- <span>通知：入驻新司机 赵师傅</span> -->
      <a-carousel dot-position="right" :dots="false" autoplay>
        <div v-for="(notice, index) of notices" :key="index">
          <span class="ro-banner-text">{{ notice }}</span>
        </div>
      </a-carousel>
    </div>
    <div class="ro-tatal-statistics">
      <TatalStatistics
        v-for="(item, key, index) of todayOrderAnalysis"
        :key="index"
        :title="item.name"
        :value="item.value"
      ></TatalStatistics>
    </div>
    <div :class="{ 'ro-map-container': true, 'ro-map-full-screen': fullScreen }">
      <button @click="fullScreen = false">返回</button>
      <Header v-if="fullScreen"></Header>
      <Chart
        :option="shallowOption.option"
        :class="{ 'is-full-screen': fullScreen, 'not-full-screen': !fullScreen }"
        :map-click="onMapClick"
      />
    </div>
    <div class="ro-map-legend">
      <span class="ro-map-export">
        地图详情
        <ArrowsAltOutlined style="font-size: 14px" @click="fullScreen = true" />
      </span>
      <div>
        <span>0~200</span>
        <div class="ro-map-example"></div>
      </div>
      <div>
        <span>200~500</span>
        <div class="ro-map-example ro-example-more"></div>
      </div>
      <div>
        <span>500+</span>
        <div class="ro-map-example ro-example-best"></div>
      </div>
    </div>
    <GaoDeMap
      v-if="proivanceDetail.show && proivanceDetail.proivanceName"
      :on-map-back="onMapBack"
      :get-map-instance="getMapInstance"
      :proivance-name="proivanceDetail.proivanceName"
    ></GaoDeMap>
  </div>
</template>

<script setup lang="ts">
import { shallowReactive, ref, onMounted } from "vue"
import { ArrowsAltOutlined } from "@ant-design/icons-vue"
import carOnline from "@/assets/images/tms/car-online.png"
import carOutline from "@/assets/images/tms/car-outline.png"
import Chart from "./chart.vue"
import { regionCodes } from "./options.js"
import { getGeojson, createInfoWindow } from "../utils/map.js"
import { optionHandle } from "./center.map"
import GaoDeMap from "./gaode-map.vue"
import TatalStatistics from "../tatal-statistics.vue"
import Header from "..//chart-head.vue"
import { TmsService } from "@/service/api/TmsService"
import dayjs from "dayjs"

interface MapdataType {
  name: string
  value: [number, number, number] //x,y,value  第一个x 第二个y  第三个value
}

const shallowOption = shallowReactive({ option: null })
const code = ref("china")
const fullScreen = ref(false) // 地图chart 是否全屏
const proivanceDetail = ref({
  show: false,
  proivanceName: "",
})
let mapInstance = null

// const statistics = [
//   {
//     name: "今日订单",
//     value: 299,
//   },
//   {
//     name: "今日完成",
//     value: 245,
//   },
//   {
//     name: "今日在线运力",
//     value: 128,
//   },
// ]

// watchEffect(() => {
//   setTimeout(() => {
//     getData(code.value)
//   }, 1000)
// })

const todayOrderAnalysis = ref({
  totalCount: {
    name: "今日订单",
    value: null,
  },
  totalFinishCount: {
    name: "今日完成",
    value: null,
  },
  totalDriverCount: {
    name: "今日在线运力",
    value: null,
  },
})

const notices = ref(null)

onMounted(() => {
  TmsService.todayOrderAnalysis().then((response: any) => {
    if (response) {
      todayOrderAnalysis.value.totalCount.value = response.totalCount || 0
      todayOrderAnalysis.value.totalDriverCount.value = response.totalDriverCount || 0
      todayOrderAnalysis.value.totalFinishCount.value = response.totalFinishCount || 0
    }
  })
  TmsService.notice().then((response: any) => {
    if (response?.length) {
      notices.value = response
    }
  })
  getData(code.value)
})

// 设置各省的数据
const dataSetHandle = async (regionCode: string, list: object[]) => {
  const geojson: any = await getGeojson(regionCode)
  // console.log("--geojson--", geojson)
  let cityCenter: any = {}
  let mapData: MapdataType[] = []
  //获取当前地图每块行政区中心点
  geojson.features.forEach((element: any) => {
    cityCenter[element.properties.name] = element.properties.centroid || element.properties.center
  })
  //当前中心点如果有此条数据中心点则赋值x，y当然这个x,y也可以后端返回进行大点，前端省去多行代码
  list.forEach((item: any) => {
    if (cityCenter[item.name]) {
      mapData.push({
        name: item.name,
        value: cityCenter[item.name].concat(item.value),
      })
    }
  })
  // await nextTick();
  const mapOption = optionHandle(regionCode, list, mapData)
  // console.log(mapOption)
  shallowOption.option = mapOption
}

// 获取省的货物数量
const getData = async (regionCode: string) => {
  const valueMap: any[] = await new Promise((resolve) => {
    TmsService.provinceStatistics().then((response: any) => {
      resolve(response?.map((item) => ({ name: item.province, value: item.count })) || [])
    })
  })

  dataSetHandle(regionCode, valueMap)
}

// 地图点击事件
const onMapClick = (params) => {
  console.log(params)
  const province = regionCodes[params.name]
  if (province) {
    proivanceDetail.value.show = true
    proivanceDetail.value.proivanceName = province.name || ""
  }
}

const onMapBack = () => {
  proivanceDetail.value.show = false
  proivanceDetail.value.proivanceName = ""
}

const getMapInstance = (mapContext, AMap) => {
  mapInstance = mapContext
  if (proivanceDetail.value.proivanceName) {
    const district = new AMap.DistrictSearch({
      subdistrict: 0, //获取边界不需要返回下级行政区
      extensions: "all", //返回行政区边界坐标组等具体信息
      level: "province", //查询行政级别为 市
    })
    district.search(proivanceDetail.value.proivanceName, function (status, result) {
      // map.remove(polygons)//清除上次结果
      const polygons = []
      var bounds = result.districtList[0].boundaries
      if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
          //生成行政区划polygon
          var polygon = new AMap.Polygon({
            strokeWeight: 1,
            path: bounds[i],
            fillOpacity: 0,
            // fillColor: "#80d8ff",
            strokeColor: "#fff",
          })
          polygons.push(polygon)
        }
      }
      mapInstance.add(polygons)
      mapInstance.setFitView(polygons) //视口自适应
      renderCarPointer(proivanceDetail.value.proivanceName, mapInstance, AMap)
    })
  }
}

const renderCarPointer = (proivanceName, map, AMap) => {
  TmsService.provinceMonitor(proivanceName)
    .then((response: any) => {
      return response
    })
    .then((response) => {
      if (response?.length) {
        const markers = []
        response.forEach((item, index) => {
          const random = Math.random()
          const deg = Math.floor(random * 360)
          const carSrc = carOnline // random > 0.5 ? carOnline : carOutline
          const marker = new AMap.Marker({
            position: new AMap.LngLat(item.longitude, item.latitude),
            title: "",
            content: `<div style="width: 15px;transform: rotate(${deg}deg);"><img style="width: 100%" src="${carSrc}" /><div>`,
            anchor: "bottom-center",
            offset: !index ? [0, 5] : [0, 8],
          })
          const content = []
          content.push(`<span>车牌号：${item.carCode}</span>`)
          content.push(`<span>时间：${item.gpsTime ? dayjs(item.gpsTime).format("YYYY-MM-DD HH:mm:ss") : "-"}</span>`)
          content.push(`<span>实时地址：${item.location}</span>`)
          content.push(`<span>经度：${item.longitude}&nbsp;&nbsp;经度：${item.latitude}</span>`)
          const close = () => {
            infoWindow.close()
          }
          const infoWindow = new AMap.InfoWindow({
            isCustom: true, //使用自定义窗体
            // content: `<div style="width: 220px;height: 120px;background: rgba(0, 212, 240, 0.34);box-shadow: 0px 2px 4px 0px rgba(0,212,240,0.34)">66666666666</div>`,
            content: createInfoWindow("", content.join("<br/>"), close),
            offset: new AMap.Pixel(16, -45),
          })
          markers.push(marker)
          marker.on("click", function () {
            infoWindow.open(map, marker.getPosition())
          })
        })
        map.add(markers)
      }
    })
}

class CustomMarker {
  private _width = 120
  private _height = 60
  constructor(
    private order: number,
    private info: any,
  ) {}

  draw() {
    console.log("this.info", this.info)
    const div = document.createElement("div")
    div.style.position = "relative"
    div.style.width = this._width + "px"
    div.style.height = this._height + "px"
    div.style.marginTop = -this._height / 2 + "px"

    return div
  }
}
</script>

<style scoped lang="less">
@import "@/assets/less/variable.less";

.ro-center-1 {
  height: 100%;
  position: relative;
  .ro-banner {
    border: 2px solid;
    border-image: linear-gradient(90deg, rgba(53, 121, 255, 0.47), rgba(53, 121, 255, 1), rgba(53, 121, 255, 0.6)) 2 2;
    background: rgba(3, 14, 94, 0.35);
    box-shadow: inset 0px 1px 182px 0px rgba(84, 181, 255, 0.3);
    padding: 5px 10px;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    right: 0;
    left: 0;

    .slick-track {
      height: 22px !important;
    }
    .ro-banner-text {
      color: #fff;
    }
  }
  .ro-tatal-statistics {
    position: absolute;
    top: 20px;
    height: 25%;
    text-align: center;
    width: 100%;
    display: flex;
    justify-content: space-around;
    z-index: 9;
    > div,
    img {
      height: 100%;
    }
    > div {
      position: relative;
      width: 33.3%;
    }
    // .ro-statistics-value {
    //   position: absolute;
    //   top: 50%;
    //   left: 50%;
    //   transform: translate(-50%, -50%);
    // }
  }
  .ro-map-container {
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    .not-full-screen {
      height: calc(100% - 60px);
      margin-top: 60px;
    }

    .is-full-screen {
      height: calc(100% - 80px);
    }

    > button {
      display: none;
    }

    &.ro-map-full-screen {
      position: fixed;
      top: 0px;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #000318;
      z-index: 99;
      overflow: hidden;
      > button {
        display: block;
        width: 80px;
        height: 35px;
        background: #3579ff;
        border-radius: 5px;
        border: 1px solid #3291f8;
        outline: none;
        cursor: pointer;
        color: #fff;
        position: absolute;
        top: 100px;
        left: 20px;
        z-index: 998;
      }
    }
  }

  .ro-map-legend {
    position: absolute;
    box-shadow: inset 0px 1px 165px 0px rgba(84, 181, 255, 0.3);
    border: 1px solid rgba(84, 181, 255, 0.5);
    padding: 10px;
    bottom: 0px;
    > div {
      display: flex;
      justify-content: space-between;
    }
    > div + div {
      margin-top: 20px;
    }
    .ro-map-example {
      width: 50px;
      height: 14px;
      background: linear-gradient(180deg, rgba(83, 167, 255, 0) 0%, rgba(0, 64, 255, 0.32) 100%);
      border: 1px solid #ffffff;
      margin-left: 10px;
    }
    .ro-example-more {
      background: linear-gradient(180deg, rgba(83, 167, 255, 0.37) 0%, rgba(0, 64, 255, 0.76) 100%);
    }
    .ro-example-best {
      background: linear-gradient(180deg, rgba(83, 167, 255, 0.76) 0%, #0040ff 100%);
    }
    .ro-map-export {
      position: absolute;
      box-shadow: inset 0px 1px 165px 0px rgba(84, 181, 255, 0.3);
      border: 1px solid rgba(84, 181, 255, 0.5);
      padding: 5px 5px 5px 10px;
      top: -40px;
      left: 0px;
      cursor: pointer;
    }
  }
}
</style>
