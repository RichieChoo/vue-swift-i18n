# 配置文件

::: tip 什么时候需要
当一个项目拥有多个模块时，vscode的系统配置是针对全局的，此时就需要优先级更高的独立配置文件
:::

## 生成

::: tip 为什么增加此功能
方便用户在不清楚配置的情况下增加配置文件
:::

![没有什么演示能比演示图更明了的了。](/generate_richierc.gif)

## 配置详情
`richierc.json`中的所有配置见[配置列表](/config/)
``` json
{
    "defaultLocalesPath": "src/locales",
    "i18nValueHover": true,
    "langFile": "zh-cn.json",
    "modulePrefixFoUpdateJson": "",
    "notAlertBeforeUpdateI18n": false,
    "parentDirLevel": 1,
    "puidType": "short"
}
```
