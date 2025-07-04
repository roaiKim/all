import { reactive, watch } from "vue"
import { debounce } from "lodash"
import { provinceValue } from "../chart/options.js"
import { getGeojson } from "./map.js"

/**
 * 监听 元素的大小变化
 * @param doc 被监听的元素
 * @param frequency 监听评率 ms
 * @returns
 */
export function useElementResizeObserver(echartsDomRef, frequency = 200) {
  // const [documentSize, setDocumentSize] =
  //   useState <
  //   DocumentSize >
  //   (() => {
  //     if (!element) {
  //       return { width: 0, height: 0 }
  //     }
  //     const { width, height } = element.getBoundingClientRect()
  //     return { width, height }
  //   })

  // useEffect(() => {
  //   if (element) {
  //     const debounceCalc = debounce((entries) => {
  //       const { width, height } = entries[0].contentRect
  //       setDocumentSize({ width, height })
  //     }, frequency)
  //     const observer = new ResizeObserver((entries) => {
  //       debounceCalc(entries)
  //     })
  //     observer.observe(element)
  //     return () => observer.disconnect()
  //   }
  // }, [element, frequency])

  // return documentSize

  const size = reactive({ domWidth: 0, domHeight: 0 })
  // console.log("-element-yyy", echartsDomRef.value)
  if (echartsDomRef.value) {
    const { width, height } = echartsDomRef.value.getBoundingClientRect()
    size.domHeight = width
    size.domHeight = height
  }

  watch(echartsDomRef, () => {
    // console.log("-element-", echartsDomRef.value, frequency)
    if (echartsDomRef.value) {
      // console.log("-sss-")
      const debounceCalc = debounce((entries) => {
        const { width, height } = entries[0].contentRect
        // setDocumentSize({ width, height })
        // const s = frequency;
        // console.log("-width, height-", width, height)
        size.domHeight = width
        size.domHeight = height
      }, frequency)
      const observer = new ResizeObserver((entries) => {
        debounceCalc(entries)
      })
      observer.observe(echartsDomRef.value)
      return () => observer.disconnect()
    }
  })

  return size
}

export const getRandomProvinceData = async (code) => {
  if (code !== "china") {
    const value = await getGeojson(code)
    if (value?.features) {
      const province = value.features.map((item) => item.properties?.name)
      const provinceData = province.map((item) => ({ name: item, value: Math.random() * 60 + 10 }))
      return new Promise((resolve) => {
        resolve(provinceData)
      })
    }
    return new Promise((resolve) => {
      resolve([])
    })
  } else {
    return new Promise((resolve) => {
      resolve(provinceValue)
    })
  }
}
