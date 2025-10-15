## eslint 集合

/-- 其他项目使用方法

// eslint.config.mjs
```js
import exampleConfigs from "eslint-config-base";
import { defineConfig } from "eslint/config";

export default defineConfig([
    exampleConfigs,
    {
        ignores: ["webpack/**", "src/index.html", "build"],
    },
]);
```

// 需要设置 .vscode/settings.json
```json
{
    "eslint.workingDirectories": [
        {
            "mode": "auto"
        }
    ]
}
```

// 还需要注意 package.json 文件中 type 字段的值 不要是 module