import dayjs from "dayjs"
import * as echarts from "echarts"

const colorfull = [
  ["rgba(77,181,255, 0.47)", "rgba(77, 181, 255, 0)"],
  ["rgba(255,218,149, 0.47)", "rgba(255,218,149, 0)"],
  ["rgba(127,191,125, 0.47)", "rgba(127,191,125, 0)"],
  ["rgba(204,149,255, 0.47)", "rgba(204,149,255, 0)"],
]

const colors = [
  [
    { offset: 1, color: "rgba(34, 66, 186, 1)" },
    // { offset: 0.1, color: "rgba(34, 66, 186, 0.5)" },
    { offset: 0, color: "rgba(34, 66, 186, 0.5)" },
  ],
]

const offsetX = 12
const offsetY = 5
// 绘制左侧面
const CubeLeft = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath: function (ctx, shape) {
    // 会canvas的应该都能看得懂，shape是从custom传入的
    const xAxisPoint = shape.xAxisPoint
    // console.log(shape);
    const c0 = [shape.x, shape.y]
    const c1 = [shape.x - offsetX, shape.y - offsetY]
    const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY]
    const c3 = [xAxisPoint[0], xAxisPoint[1]]
    ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
  },
})
// 绘制右侧面
const CubeRight = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath: function (ctx, shape) {
    const xAxisPoint = shape.xAxisPoint
    const c1 = [shape.x, shape.y]
    const c2 = [xAxisPoint[0], xAxisPoint[1]]
    const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY]
    const c4 = [shape.x + offsetX, shape.y - offsetY]
    ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
  },
})
// 绘制顶面
const CubeTop = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath: function (ctx, shape) {
    const c1 = [shape.x, shape.y]
    const c2 = [shape.x + offsetX, shape.y - offsetY] // 右点
    const c3 = [shape.x, shape.y - offsetX]
    const c4 = [shape.x - offsetX, shape.y - offsetY]
    ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
  },
})
// 注册三个面图形
echarts.graphic.registerShape("CubeLeft", CubeLeft)
echarts.graphic.registerShape("CubeRight", CubeRight)
echarts.graphic.registerShape("CubeTop", CubeTop)

const LinearGradient = [
  {
    offset: 1,
    color: "rgba(84,181,255,0.9)",
  },
  // {
  //   offset: 0.7,
  //   color: "#0da0e7e0",
  // },
  {
    offset: 0,
    color: "rgba(84,181,255,0)",
  },
]

function getRenderItem(params, api) {
  const index = params.seriesIndex
  let location = api.coord([api.value(0) + index, api.value(1)])
  // if (config) {
  //   console.log("--params--", params)
  //   console.log("--api--", api.value(0), api.value(1), api.value(2), api.value(3))
  // }

  // 无数据
  if (!api.value(1)) {
    return null
  }

  return {
    type: "group",
    children: [
      {
        type: "CubeLeft",
        barWidth: 20,
        shape: {
          api,
          xValue: api.value(0),
          yValue: api.value(1),
          x: location[0],
          y: location[1],
          xAxisPoint: api.coord([api.value(0), 0]),
        },
        style: {
          fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, LinearGradient),
        },
      },
      {
        type: "CubeRight",
        shape: {
          api,
          xValue: api.value(0),
          yValue: api.value(1),
          x: location[0],
          y: location[1],
          xAxisPoint: api.coord([api.value(0), 0]),
        },
        style: {
          fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, LinearGradient),
        },
      },
      {
        type: "CubeTop",
        shape: {
          api,
          xValue: api.value(0),
          yValue: api.value(1),
          x: location[0],
          y: location[1],
          xAxisPoint: api.coord([api.value(0), 0]),
        },
        style: {
          fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, LinearGradient),
        },
      },
    ],
  }
}

export const left3Option = (list) => {
  return {
    tooltip: {
      trigger: "axis",
    },
    color: ["#0095FF", "#FFB85F", "#48A345", "#A65FFF"],
    // color: ['77,181,255', '#255,218,149', '#127,191,125', '#204,149,255'],
    legend: {
      data: ["货主", "运力", "司机"],
      // bottom: 0,
      textStyle: {
        color: "#fff",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        // saveAsImage: {}
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: list.map((item) => item.yearOfMonth), // ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      axisLabel: {
        color: "#fff",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#fff",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#283946"],
          type: "dashed",
        },
      },
      minInterval: 1,
    },
    dataset: {
      dimensions: ["yearOfMonth", "clientCount", "carCount", "driverCount"],
      source: list,
    },
    series: [
      {
        name: "货主",
        type: "line",
        // stack: 'Total',
        // data: [100, 132, 101, 134, 90, 104, 116, 128, 132, 137, 149, 158],
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(77,181,255, 0.47)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(77, 181, 255, 0)", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
      {
        name: "运力",
        type: "line",
        // stack: 'Total',
        // data: [220, 182, 191, 214, 230, 256, 270, 220, 182, 191, 214, 230],
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(255,218,149, 0.47)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(255,218,149, 0)", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
      {
        name: "司机",
        type: "line",
        // stack: 'Total',
        // data: [150, 232, 201, 154, 190, 230, 256, 270, 282, 299, 303, 326],
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(127,191,125, 0.47)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(127,191,125, 0)", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  }
}
export const right3Option = (list) => {
  const source = {}
  const dates = {}
  list.forEach((item) => {
    const { count, date, name } = item
    const times = dayjs(date).format("MM-DD") //new Date(date).getTime()
    if (!dates[times]) {
      dates[times] = times
    }
    if (source[name]) {
      source[name].push({
        name: times,
        value: count,
        type: name,
      })
    } else {
      source[name] = [
        {
          name: times,
          value: count,
          type: name,
        },
      ]
    }
  })
  return {
    tooltip: {
      trigger: "axis",
    },
    color: ["#0095FF", "#FFB85F", "#48A345", "#A65FFF"],
    // color: ['77,181,255', '#255,218,149', '#127,191,125', '#204,149,255'],
    legend: {
      data: Object.keys(source), // ["油车", "电车", "LNG", "氢能"],
      textStyle: {
        color: "#fff",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        // saveAsImage: {}
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: Object.keys(dates), // list.map((item) => item.date),
      axisLabel: {
        color: "#fff",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#fff",
      },
      // min: 0,
      // max: 250,
      minInterval: 1,
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#283946"],
          type: "dashed",
        },
      },
    },
    // dataset: {
    //   dimensions: ["date", "clientCount", "carCount", "driverCount"],
    //   source: list,
    // },
    series: Object.keys(source).map((item, index) => ({
      name: item,
      type: "line",
      data: source[item].map((item1) => [item1.name, item1.value]), // [150, 182, 199, 155, 172, 188, 151],
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: colorfull[index % colorfull.length][0], // 0% 处的颜色
            },
            {
              offset: 1,
              color: colorfull[index % colorfull.length][1], // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
    })),
  }
}

export const center3Option = (list) => {
  return {
    tooltip: {
      trigger: "axis",
    },
    color: ["#0095FF", "#FFB85F", "#48A345", "#A65FFF"],
    legend: {
      data: ["订单数量", "订单货量"],
      textStyle: {
        color: "#fff",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        // saveAsImage: {}
      },
    },
    xAxis: {
      type: "category",
      data: list.map((item) => item.yearOfMonth), // ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      axisLabel: {
        color: "#fff",
        // interval: 0,
      },
    },
    yAxis: [
      {
        // name: "订单数量",
        type: "value",
        axisLabel: {
          color: "#fff",
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ["#283946"],
            type: "dashed",
          },
        },
        minInterval: 1,
      },
      {
        // name: "订单货量",
        type: "value",
        axisLabel: {
          color: "#fff",
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ["#283946"],
            type: "dashed",
          },
        },
        minInterval: 1,
      },
    ],
    // dataset: {
    //   dimensions: ["yearOfMonth", "orderCount", "totalWeight"],
    //   source: list,
    // },
    series: [
      {
        name: "订单数量",
        data: list.map((item) => item.orderCount), // [120, 186, 150, 80, 70, 110, 130, 145, 167, 158, 194, 120],
        type: "custom",
        renderItem: function (params, api) {
          return getRenderItem(params, api)
        },
        itemStyle: {
          color: () => {
            return new echarts.graphic.LinearGradient(0, 0, 0.1, 1, colors[0])
          },
        },
      },
      {
        name: "订单货量",
        type: "line",
        data: list.map((item) => item.totalWeight), // [150, 182, 199, 155, 172, 188, 151, 129, 140, 89, 145, 192],
        yAxisIndex: 1,
      },
    ],
  }
}

export const right2Option1 = (list) => {
  return {
    tooltip: {
      trigger: "axis",
    },
    color: ["#0095FF", "#FFB85F", "#48A345", "#A65FFF"],
    grid: {
      top: "15%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
      borderColor: "red",
    },
    toolbox: {
      feature: {
        // saveAsImage: {}
      },
    },
    xAxis: {
      type: "category",
      data: list.map((item) => item.name), //["轻卡", "小卡", "重卡", "VNN卡"],
      axisLabel: {
        color: "#fff", // #283946
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#fff",
      },
      // splitLine: {
      //   show: true,
      //   lineStyle: {
      //     color: ["#283946"],
      //     opacity: 0.2,
      //     type: "dashed",
      //   },
      // },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#283946"],
          type: "dashed",
        },
      },
      minInterval: 1,
    },
    series: [
      {
        // name: '订单数量',
        data: list.map((item) => item.count), //[220, 246, 350, 280],
        type: "custom",
        renderItem: function (params, api) {
          return getRenderItem(params, api)
        },
        itemStyle: {
          color: () => {
            return new echarts.graphic.LinearGradient(0, 0, 0.1, 1, colors[0])
          },
        },
      },
    ],
  }
}

export const right2Option2 = (list) => {
  return {
    tooltip: {
      trigger: "axis",
    },
    color: ["#0095FF", "#FFB85F", "#48A345", "#A65FFF"],
    grid: {
      top: "15%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
      borderColor: "red",
    },
    toolbox: {
      feature: {
        // saveAsImage: {}
      },
    },
    xAxis: {
      type: "category",
      data: list.map((item) => item.name), // ["油车", "电车", "LNG", "氢能"],
      axisLabel: {
        color: "#fff", // #283946
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#fff",
      },
      // splitLine: {
      //   show: true,
      //   lineStyle: {
      //     color: ["#283946"],
      //     opacity: 0.2,
      //     type: "dashed",
      //   },
      // },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#283946"],
          type: "dashed",
        },
      },
      minInterval: 1,
    },
    series: [
      {
        // name: '订单数量',
        data: list.map((item) => item.count), // [120, 186, 150, 80],
        type: "custom",
        renderItem: function (params, api) {
          return getRenderItem(params, api)
        },
        itemStyle: {
          color: () => {
            return new echarts.graphic.LinearGradient(0, 0, 0.1, 1, colors[0])
          },
        },
      },
    ],
  }
}

export const provinceValue = [
  {
    name: "青海省",
    value: 123,
  },
  {
    name: "天津",
    value: 543,
  },
  {
    name: "江西省",
    value: 681,
  },
  {
    name: "河北省",
    value: 291,
  },
  {
    name: "甘肃省",
    value: 306,
  },
  {
    name: "新疆维吾尔自治区",
    value: 1081,
  },
  {
    name: "重庆",
    value: 858,
  },
  {
    name: "海南省",
    value: 402,
  },
  {
    name: "湖南省",
    value: 421,
  },
  {
    name: "上海",
    value: 598,
  },
]

export const regionCodes = {
  中国: {
    adcode: "100000",
    level: "country",
    name: "中华人民共和国",
  },
  新疆维吾尔自治区: {
    adcode: "650000",
    level: "province",
    name: "新疆维吾尔自治区",
    lnglats: [
      [86.184885, 41.770255],
      [86.497183, 41.959003],
      [86.094765, 41.605978],
    ],
  },
  湖北省: {
    adcode: "420000",
    level: "province",
    name: "湖北省",
  },
  辽宁省: {
    adcode: "210000",
    level: "province",
    name: "辽宁省",
  },
  广东省: {
    adcode: "440000",
    level: "province",
    name: "广东省",
    lnglats: [
      [113.234111, 23.083927],
      [113.180975, 23.089455],
      [114.06335, 22.543388],
      [113.952594, 22.558222],
    ],
  },
  内蒙古自治区: {
    adcode: "150000",
    level: "province",
    name: "内蒙古自治区",
  },
  黑龙江省: {
    adcode: "230000",
    level: "province",
    name: "黑龙江省",
  },
  河南省: {
    adcode: "410000",
    level: "province",
    name: "河南省",
  },
  山东省: {
    adcode: "370000",
    level: "province",
    name: "山东省",
  },
  陕西省: {
    adcode: "610000",
    level: "province",
    name: "陕西省",
  },
  贵州省: {
    adcode: "520000",
    level: "province",
    name: "贵州省",
  },
  上海市: {
    adcode: "310000",
    level: "province",
    name: "上海市",
  },
  重庆市: {
    adcode: "500000",
    level: "province",
    name: "重庆市",
  },
  西藏自治区: {
    adcode: "540000",
    level: "province",
    name: "西藏自治区",
  },
  安徽省: {
    adcode: "340000",
    level: "province",
    name: "安徽省",
  },
  福建省: {
    adcode: "350000",
    level: "province",
    name: "福建省",
  },
  湖南省: {
    adcode: "430000",
    level: "province",
    name: "湖南省",
    lnglats: [
      [111.489477, 27.708493],
      [111.438954, 27.253391],
      [111.968062, 27.11804],
      [112.930926, 27.863786],
      [112.948769, 28.230474],
    ],
  },
  海南省: {
    adcode: "460000",
    level: "province",
    name: "海南省",
  },
  江苏省: {
    adcode: "320000",
    level: "province",
    name: "江苏省",
  },
  青海省: {
    adcode: "630000",
    level: "province",
    name: "青海省",
  },
  广西壮族自治区: {
    adcode: "450000",
    level: "province",
    name: "广西壮族自治区",
  },
  宁夏回族自治区: {
    adcode: "640000",
    level: "province",
    name: "宁夏回族自治区",
  },
  浙江省: {
    adcode: "330000",
    level: "province",
    name: "浙江省",
  },
  河北省: {
    adcode: "130000",
    level: "province",
    name: "河北省",
  },
  香港特别行政区: {
    adcode: "810000",
    level: "province",
    name: "香港特别行政区",
  },
  台湾省: {
    adcode: "710000",
    level: "province",
    name: "台湾省",
  },
  澳门特别行政区: {
    adcode: "820000",
    level: "province",
    name: "澳门特别行政区",
  },
  甘肃省: {
    adcode: "620000",
    level: "province",
    name: "甘肃省",
  },
  四川省: {
    adcode: "510000",
    level: "province",
    name: "四川省",
  },
  天津市: {
    adcode: "120000",
    level: "province",
    name: "天津市",
  },
  江西省: {
    adcode: "360000",
    level: "province",
    name: "江西省",
  },
  云南省: {
    adcode: "530000",
    level: "province",
    name: "云南省",
  },
  山西省: {
    adcode: "140000",
    level: "province",
    name: "山西省",
  },
  北京市: {
    adcode: "110000",
    level: "province",
    name: "北京市",
  },
  吉林省: {
    adcode: "220000",
    level: "province",
    name: "吉林省",
  },
}
