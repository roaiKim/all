## eslint 集合

/-- 其他项目使用方法

// .eslintrc.js
```js
module.exports = {
    extends: ["rosen"],
};
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