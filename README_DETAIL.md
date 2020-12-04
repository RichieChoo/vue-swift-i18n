# 插件详述

> 约定：**汉字**--`汉字开头的连续非空字符串`

## 一、Json 生成，更新(Ctrl+Alt+U)

### 1.汉字检索原则
  - 位于`<template></template>`中的汉字，如`<span>汉字123</span>`
  - 位于`<template></template>`中的标签属性的汉字，如`<span title="汉字"></span>`
  - 位于`<template></template>`中的`{{`与`}}`之间的汉字，如`<span>{{test ? "汉字" : "中文" }}</span>`
  - 位于`<script></script>`中的`"`与`"`之间的汉字，`'`与`'`之间的**汉字**
  - 过滤单行注释
### 2. 生成更新 Json 路径配置,见[路径及 JSON](#r4EQa)
### 3. 生成更新原则
  - 当 json 为空或者文件不存在，将检测的**汉字**当做 value，将[`modulePrefix`].[`parents(level 读取)`].[`当前 vue 文件名字`]+唯一 Id 当做 key，存储在 json 中
  - 当 json 文件不为空，执行智能替换
    备注：主要是防止国际化后，执行 JSON 生成命令误操作，会导致 json 数据为空或错误
  - 智能替换：
    i. 相同 val 时，新的 key,val 替换原来的 key,val
    ii. 不同 val 时，保存新增 key,val 和原有的 key,val

## 二、国际化替换(Ctrl+Alt+I)

### 1. 替换原则

- 汉字检索原则 1，**汉字 123**替换为  **`{{$t('unique-key')}}`**
- 汉字检索原则 2，**`title="汉字"`**  替换为  **`:title="$t('unique-key')"`**
- 汉字检索原则 3，**汉字**替换为 **`$t('unique-key')`**
- 汉字检索原则 4，**汉字**替换为 **`this.$t('unique-key')`**

### 2. 相关正则，见[传送门](https://github.com/RichieChoo/vue-swift-i18n/blob/master/utils/regex.js)
### 3. 替换依据 Json,见[路径及 JSON](#r4EQa)

## 三、国际化提示(Ctrl+Alt+O)

### 1. 提示原则

- 正则：`/(?<=\$t\(["'])[^'"]+/gm`  匹配已替换的字符串
- 用新生成的唯一 key 而不是 json 的 key 来标识，为了防止 json 中的 key 被使用多次

### 2. 提示依据 Json,见[路径及 JSON](#r4EQa)

## 四、Json 扁平处理

### 1. 扁平化原则：

- 将所有的有 value 的 key 的所有父对象和 key 用`.`连接
- Json 扁平处理没有提供快捷键，通过右键文件夹或者 json 文件来执行命令

### 2. 扁平依据选中 json，生成/更新 xxx_flat.json 与 json 文件路径同级

## 五、路径及 JSON

> 根目录：认定当前项目`package.json`为根目录
> 当前文件：执行 Json 生成等命令所在的文件

### 1. 路径

- 默认路径：**`[根目录]/src/locales/zh-cn.json`** 为默认 json 路径
- 提供字符串配置项：**`Default Locales Path`**,如"test",则对应的 json 路径：**` [根目录]/``test/zh-cn.json `**

### 2. json 文件的属性名及 value

- 默认：**[当前文件的父文件夹名].[当前文件名(无后缀)]**
  到父文件夹名之前
- 其他配置项：
  - **`Not Alert Before Update I18n`**，默认提示，若为 true 则会直接更新 json 不弹窗提醒
  - **`Do Not Disturb`**,默认 false,若为 true 则会关闭任何命令提醒
  - **`I18n Value Hover`**，默认 true,开启悬浮提示框功能

## 六、代码提示

1. 汉字检索原则 1，**`tt`** 替换为  **`{{$t('剪切板内容')}}`**
1. 汉字检索原则 2，**`t`**  替换为  **`$t('剪切板内容')`**，需手动加`：`
1. 汉字检索原则 3，**`t`**  替换为 **`$t('剪切板内容')`**
1. 汉字检索原则 4，**`ttt`** 替换为 **`this.$t('剪切板内容')`**

# 文档及帮助

|                内容                |                                           文档及帮助                                           |
| :--------------------------------: | :--------------------------------------------------------------------------------------------: |
|          插件 hello-world          |         [[传送门]](https://code.visualstudio.com/api/get-started/your-first-extension)         |
|        插件发布流程（官方）        |   [[传送门]](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)   |
|        vscode 插件官方实例         |               [[传送门]](https://github.com/microsoft/vscode-extension-samples)                |
|         如何检测 vue 文件          | [[传送门]](https://code.visualstudio.com/api/language-extensions/language-configuration-guide) |
|             vscode API             |              [[传送门]](https://code.visualstudio.com/api/references/vscode-api)               |
|        vscode 开发（中文）         |         [[传送门]](https://www.cnblogs.com/liuxianan/p/vscode-plugin-hello-world.html)         |
| webstorm 配置 ide 的 live template |                       [[传送门]](https://www.jianshu.com/p/02a2d2c1b556)                       |

# 其他推荐

### 1. vscode 正则  `[\u4e00-\u9fa5]` 查找汉字
### 2. vscode 插件 expand-region 来扩展选择,方便选中复制
