import { registerMap, getMap } from "echarts/core"
import { GETNOBASE } from "@/http/network"

export const getGeojson = (regionCode) => {
  return new Promise((resolve) => {
    let mapjson = getMap(regionCode)
    if (mapjson) {
      mapjson = mapjson.geoJSON
      resolve(mapjson)
    } else {
      GETNOBASE(`./map-geojson/${regionCode}.json`).then((response) => {
        registerMap(regionCode, {
          geoJSON: response,
          specialAreas: {},
        })
        resolve(response)
      })
    }
  })
}

export function createInfoWindow(title, content, closeInfoWindow) {
  var info = document.createElement("div")
  info.className = "custom-info input-card content-window-card"

  //可以通过下面的方式修改自定义窗体的宽高
  info.style.width = "400px"
  info.style.fontSize = "14px"

  info.style.backgroundColor = "#435297" // "rgba(0, 212, 240, 0.7)"

  info.style.boxShadow = "0px 2px 4px 0px rgba(0,212,240,0.34)"

  // 定义顶部标题
  var top = document.createElement("div")
  var titleD = document.createElement("div")
  var closeX = document.createElement("img")
  top.className = "info-top"
  top.style.textAlign = "right"
  top.style.padding = "5px 5px 0px"
  titleD.innerHTML = title
  closeX.src = "https://webapi.amap.com/images/close2.gif"
  // closeX.src = "..../../assets/images/tms/highway.png"
  closeX.style.cursor = "pointer"
  closeX.onclick = closeInfoWindow

  top.appendChild(titleD)
  top.appendChild(closeX)
  info.appendChild(top)

  // 定义中部内容
  var middle = document.createElement("div")
  middle.className = "info-middle"
  middle.style.padding = "0px 10px 10px"
  middle.innerHTML = content
  info.appendChild(middle)

  // // 定义底部内容
  // var bottom = document.createElement("div")
  // bottom.className = "info-bottom"
  // bottom.style.position = "relative"
  // bottom.style.top = "0px"
  // bottom.style.margin = "0 auto"
  // var sharp = document.createElement("img")
  // sharp.src = "https://webapi.amap.com/images/sharp.png"
  // bottom.appendChild(sharp)
  // info.appendChild(bottom)
  return info
}
