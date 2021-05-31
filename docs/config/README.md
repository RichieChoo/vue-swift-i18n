# 插件配置

## defaultLocalesPath
- 类型：`string`
- 默认值：`src/locales`
- 描述：指定vue-swift-i18n更新国际化JSON和快速展示国际化JSON的文件目录地址。

## doNotDisturb
- 类型：`boolean`
- 默认值：`false`
- 描述：执行命令时候是否弹窗提醒。

## i18nValueHover
- 类型：`boolean`
- 默认值：`true`
- 描述：是否开启悬浮展示key/value及跳转功能。

## langFile
- 类型：`string`
- 默认值：`zh-cn.json`
- 描述：指定国际化JSON文件名称。

## puidType
- 类型：`string`
- 默认值：`short`
- 描述：为国际化JSON的value生成唯一key的类型，默认为short，长度为12，一般不需要配置。

## modulePrefixFoUpdateJson
- 类型：`string`
- 默认值：`""`
- 描述：更新国际化JSON时以此前缀当做模块前缀，默认为空，当一个项目有多个vue模块，每个模块都有对应的国际化需求时，推荐使用单独的配置文件[richierc.json]()。

## notAlertBeforeUpdateI18n

- 类型：`boolean`
- 默认值：`false`
- 描述：更新国际化JSON时是否禁止展示更新文件地址，默认展示。

## notUseFileNameAsKey

- 类型：`boolean`
- 默认值：`false`
- 描述：是否使用文件名作为key前缀，默认是。

## fileNameSubstitute

- 类型：`string`
- 默认值：`components`
- 描述：当**notUseFileNameAsKey**为true生效，作为fileName的替代使用。

## parentDirLevel

- 类型：`number`
- 默认值：`1`
- 描述：更新国际化JSON时会以父文件夹及文件名为`scope`,防止不同文件更新JSON相互干扰，此配置为父文件夹得层级，默认为`1`。比如`HelloWord.vue`在`src/components`文件夹下：则对应scope如下所示：
    ``` bash
    {
        "components":{
            "HelloWord":{
                // HelloWord.vue 的 scope
            }
        }
    }
    ```




