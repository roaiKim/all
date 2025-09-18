## stylelint 集合

/-- 其他项目使用方法

// stylelint.json
```json
{
    "extends": ["stylelint-config-base"]
}

```

// 需要设置 .vscode/settings.json
```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.stylelint": "explicit"
    },
    "stylelint.packageManager": "yarn",
    "stylelint.validate": ["css", "less"],
    "stylelint.configFile": "./stylelint.json"
}
```
