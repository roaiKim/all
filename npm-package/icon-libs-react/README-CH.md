
[English](./README.md) | [中文](./README-CH.md) 

# RoveIconSelector 图标选择器组件

## 组件介绍

RoveIconSelector 是一个基于[react-icons@^5.5.0](https://github.com/react-icons/react-icons)版本的的封装库，提供其全部的图标选择

1. 说明 <span style="color: red"> rove-icon-react 包含[react-icons@^5.5.0](https://github.com/react-icons/react-icons)全部的图标库的选择器，所以会打包所有图标，无法 Tree shaking</span>  

2. RoveIcon 组件使用时 则只会加载 当前图标库下的图标(会有缓存), 其他库则不会加载, 但是依然会打包所有

3. `RoveIconSelector, RoveIcon` 搭配使用 `RoveIconSelector` 选择图标, `RoveIcon` 则是选择后的使用

## 特性



* 支持多种图标库选择

* 可以排除图标库选择

* 实时搜索筛选图标

* 可调整图标尺寸

* 自定义图标颜色

* 复制图标信息功能

* 支持国际化

* 可配置显示 / 隐藏功能项

* MIT 协议图标筛选

## 安装



```
npm install rove-icon-react

\# 或

yarn add rove-icon-react
```

## 导入组件



```
import { RoveIconSelector, RoveIcon } from 'rove-icon-react';
```

## 基本使用



```tsx
import React, { useState } from 'react';
import { RoveIconSelector, RoveIcon } from 'rove-icon-react';

function App() {
    const [state, setState] = useState<IconSelectorState>({
        lib: "ai",
        name: "",
        width: 24,
        height: 24,
        color: "#000000",
    });

    return (
        <div style={{ width: "calc(100vw - 100px)", height: "80vh", display: "flex" }}>
            <RoveIconSelector
                isPopup
                onConfirm={(state) => {
                    setState(state);
                }}
            ></RoveIconSelector>
            <div style={{ marginLeft: 20 }}></div>
            <RoveIcon {...state} />
        </div>
    );
}

export default App;
```

## 属性说明

### IconSelectorProps


| 属性名          | 类型                                   | 默认值     | 说明              |
| ------------ | ------------------------------------ | ------- | --------------- |
| style          | `React.CSSProperties`                   | -       | style        |
| title          | `string`                   | -       | 弹窗的header title        |
| isPopup          | `boolean`                   | `false`       | 是否弹窗形式        |
| lib          | `RoveIconLibsType`                   | `ai`       | 初始选中的图标库        |
| name         | `string`                             | -       | 初始选中的图标名称       |
| onConfirm    | `(state: IconSelectorState) => void` | -       | 确认选择时的回调函数      |
| showSize     | `boolean`                            | `true`  | 是否显示尺寸输入框       |
| showColor    | `boolean`                            | `true`  | 是否显示颜色选择器       |
| showCopy     | `boolean`                            | `true`  | 是否显示复制按钮        |
| showCopyName | `boolean`                            | `true`  | 是否显示复制名称按钮      |
| MIT          | `boolean`                            | `false` | 是否只显示 MIT 协议的图标 |
| exclude      | `RoveIconLibsType[]`                 | `[]`    | 排除的图标库列表        |
| include      | `RoveIconLibsType[]`                 | -       | 包含的图标库列表（优先级最高） |


### IconSelectorState


| 属性名    | 类型                 | 默认值         | 说明      |
| ------ | ------------------ | ----------- | ------- |
| lib    | `RoveIconLibsType` | `"ai"`      | 选中的图标库  |
| name   | `string`           | `null`      | 选中的图标名称 |
| width  | `number`           | `24`        | 图标的宽度   |
| height | `number`           | `24`        | 图标的高度   |
| color  | `string`           | `"#000000"` | 图标的颜色   |



### RoveIconLibsType

```ts
type RoveIconLibsType =
    | "ci"
    | "fa"
    | "fa6"
    | "io"
    | "io5"
    | "md"
    | "ti"
    | "go"
    | "fi"
    | "lu"
    | "gi"
    | "wi"
    | "di"
    | "ai"
    | "bs"
    | "ri"
    | "fc"
    | "gr"
    | "hi"
    | "hi2"
    | "si"
    | "sl"
    | "im"
    | "bi"
    | "cg"
    | "vsc"
    | "tb"
    | "tfi"
    | "rx"
    | "pi"
    | "lia";
```

## 事件说明

### onConfirm

确认选择时触发的回调函数，返回当前选中图标的完整状态。



```ts
const handleConfirm = (state) => {​
  console.log('Icon selected:', state);​
  // state 包含: lib, name, width, height, color​
};
```

## 图标库支持

组件支持 react-icons 库中的所有图标库 [查看](https://github.com/react-icons/react-icons?tab=readme-ov-file#icons)


## 高级用法

### 1. 只显示指定的图标库



```ts
<IconSelector
    include={['ai', 'fa', 'md']}
    onConfirm={handleIconConfirm}
/>
```

### 2. 排除某些图标库



```ts
<IconSelector
    exclude={['ai', 'fa', 'md']}
    onConfirm={handleIconConfirm}
/>
```

### 3. 只显示 MIT 协议的图标



```ts
<IconSelector
    MIT={true}
    onConfirm={handleIconConfirm}
/>
```


## 样式说明

组件使用以下 CSS 类名，可根据需要进行自定义：


## 国际化支持

组件集成了国际化功能 (RoveContext)
> 内置 英文|中文，其他语言 参考[这个例子]()

```ts
function Example() {
    const [state, setState] = useState<IconSelectorState>({
        lib: "ai",
        name: "",
        width: 24,
        height: 24,
        color: "#000000",
    });
    return (
        <div style={{ width: "calc(100vw - 100px)", height: "80vh", display: "flex" }}>
            <RoveContext.Provider
                value={{
                    type: "ch",
                }}
            >
                <>
                    <RoveIconSelector
                        isPopup
                        onConfirm={(state) => {
                            setState(state);
                        }}
                    ></RoveIconSelector>
                    <div style={{ marginLeft: 20 }}></div>
                    <RoveIcon {...state} />
                </>
            </RoveContext.Provider>
        </div>
    );
}
```

1. RoveContext 支持 type 和 language
```ts
<RoveContext.Provider
    value={{
        type: "en",
        language: {
            "rove-modal-title": "my modal title",
        },
    }}
>
//...
<RoveContext.Provider/>
```

2. language中的key
```ts
{
    "rove-modal-title": "select icon",
    "rove-modal-select-name": "select",
    "rove-selector-width": "width",
    "rove-selector-height": "height",
    "rove-selector-color": "color",
    "rove-selector-copyname": "Copy name",
    "rove-selector-copy": "Copy",
    "rove-selector-ok": "Confirm",
    "rove-search-placeholder": "Search icon name",
    "rove-search-button": "Search",
}
``` 

# RoveIcon 

```ts
interface RoveIconProps = {
    /**
     * @description lib name
     */
    lib: RoveIconLibsType;
    /**
     * @description icon name
     */
    name: string;
    /**
     * @description width
     * @default 24 px
     */
    width?: number;
    /**
     * @description width
     * @default 24 px
     */
    height?: number;
    /**
     * @description icon color
     */
    color?: string;
    /**
     * @description if not found,return it
     */
    fallback?: React.ReactNode;
    /**
     * @description loading, show it
     */
    loadingIndicator?: React.ReactNode;
}

<RoveIcon lib="ai" name="AiFillAudio" width={30} height={30} />
```


## 注意事项



1. **图标库加载**：图标库会在选择时动态加载，首次使用可能会有加载延迟

2. **协议问题**：react-icons 中的图标库并非都基于 MIT 协议，使用时请注意相关许可协议 (可以使用 MIT 参数控制)

3. **性能优化**：建议根据项目需要使用 `include` 属性限制加载的图标库数量

4. **搜索功能**：搜索功能不区分大小写，会匹配图标名称的任意部分


## License
MIT