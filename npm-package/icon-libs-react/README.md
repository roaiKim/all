[English](./README.md) | [中文](./README-CH.md) 

# RoveIconSelector Icon Picker Component

## Component Introduction

RoveIconSelector is a wrapper library based on [react-icons@^5.5.0](https://github.com/react-icons/react-icons), providing access to all its icon selections.

1. Note: <span style="color: red">rove-icon-react includes the selector for all icon libraries from [react-icons@^5.5.0](https://github.com/react-icons/react-icons), so it will bundle all icons and cannot be tree-shaken.</span>

2.  When using the RoveIcon component, only icons from the currently selected icon library will be loaded (with caching), while other libraries will not be loaded. However, all libraries are still bundled.

3. `RoveIconSelector` and `RoveIcon` are used together: `RoveIconSelector` for selecting icons, and `RoveIcon` for using the selected icons.

## Features



* Support for multiple icon library selections

* Ability to exclude specific icon libraries

* Real-time search and filtering of icons

* Adjustable icon size

* Customizable icon color

* Icon information copying functionality

* Internationalization support

* Configurable display/hide of feature items

* MIT license icon filtering

## Installation



```
npm install rove-icon-react

\# or

yarn add rove-icon-react
```

## Import Component



```
import { RoveIconSelector, RoveIcon } from 'rove-icon-react';
```

## Basic Usage



```ts
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

## Property Description

### IconSelectorProps



| Property     | Type                                 | Default | Description                                        |
| ------------ | ------------------------------------ | ------- | -------------------------------------------------- |
| style        | `React.CSSProperties`                | -       | Custom style for the component                     |
| title        | `string`                             | -       | Popup header title                                 |
| isPopup      | `boolean`                            | `false` | Whether to display as a popup                      |
| lib          | `RoveIconLibsType`                   | `ai`    | Initially selected icon library                    |
| name         | `string`                             | -       | Initially selected icon name                       |
| onConfirm    | `(state: IconSelectorState) => void` | -       | Callback function when confirming selection        |
| showSize     | `boolean`                            | `true`  | Whether to show size input                         |
| showColor    | `boolean`                            | `true`  | Whether to show color picker                       |
| showCopy     | `boolean`                            | `true`  | Whether to show copy button                        |
| showCopyName | `boolean`                            | `true`  | Whether to show copy name button                   |
| MIT          | `boolean`                            | `false` | Whether to only show MIT licensed icons            |
| exclude      | `RoveIconLibsType[]`                 | `[]`    | List of excluded icon libraries                    |
| include      | `RoveIconLibsType[]`                 | -       | List of included icon libraries (highest priority) |

### IconSelectorState



| Property | Type               | Default     | Description           |
| -------- | ------------------ | ----------- | --------------------- |
| lib      | `RoveIconLibsType` | `"ai"`      | Selected icon library |
| name     | `string`           | `null`      | Selected icon name    |
| width    | `number`           | `24`        | Icon width            |
| height   | `number`           | `24`        | Icon height           |
| color    | `string`           | `"#000000"` | Icon color            |

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

## Event Description

### onConfirm

Callback function triggered when confirming selection, returns the complete state of the currently selected icon.



```ts
const handleConfirm = (state) => {​
  console.log('Icon selected:', state);​
  // state 包含: lib, name, width, height, color​
};
```

## Icon Library Support

The component supports all icon libraries from the react-icons library [View](https://github.com/react-icons/react-icons?tab=readme-ov-file#icons)

## Advanced Usage

### 1. Show only specified icon libraries



```ts
<IconSelector
    include={['ai', 'fa', 'md']}
    onConfirm={handleIconConfirm}
/>
```

### 2. Exclude certain icon libraries



```ts
<IconSelector
    exclude={['ai', 'fa', 'md']}
    onConfirm={handleIconConfirm}
/>
```

### 3. Show only MIT licensed icons



```ts
<IconSelector
    MIT={true}
    onConfirm={handleIconConfirm}
/>
```

## Style Description

The component uses the following CSS class names, which can be customized as needed:

## Internationalization Support

The component integrates internationalization functionality (RoveContext)

> Built-in English|Chinese, for other languages refer to this example



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



1. RoveContext supports type and language



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



1. Keys in language



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

## Notes



1. **Icon Library Loading**: Icon libraries are loaded dynamically when selected, which may cause a loading delay on first use.

2. **License Issues**: Not all icon libraries in react-icons are based on the MIT license. Please pay attention to the relevant license agreements when using them (can be controlled using the MIT parameter).

3. **Performance Optimization**: It is recommended to use the `include` property to limit the number of loaded icon libraries according to project needs.

4. **Search Functionality**: The search function is case-insensitive and will match any part of the icon name.

## License

MIT
