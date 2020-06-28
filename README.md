# Vue i18n

[![](https://vsmarketplacebadge.apphb.com/version/RichieChoo.vue-swift-i18n.svg
)](https://marketplace.visualstudio.com/items?itemName=RichieChoo.vue-swift-i18n)
[![](https://vsmarketplacebadge.apphb.com/installs-short/RichieChoo.vue-swift-i18n.svg
)](https://marketplace.visualstudio.com/items?itemName=RichieChoo.vue-swift-i18n)
[![](https://vsmarketplacebadge.apphb.com/downloads-short/RichieChoo.vue-swift-i18n.svg
)](https://marketplace.visualstudio.com/items?itemName=RichieChoo.vue-swift-i18n)
[![](https://vsmarketplacebadge.apphb.com/rating-short/RichieChoo.vue-swift-i18n.svg
)](https://marketplace.visualstudio.com/items?itemName=RichieChoo.vue-swift-i18n)
[![](https://vsmarketplacebadge.apphb.com/trending-monthly/RichieChoo.vue-swift-i18n.svg
)](https://marketplace.visualstudio.com/items?itemName=RichieChoo.vue-swift-i18n)

[英文版](./README_EN.md)

## 契子
国际化非常的繁琐:

- 将所有出现的要国际化的汉字复制取名配置
- 在vue/js文件中找到汉字位置，区分是在`template`中标签的`label`或者其他`property`中，或者`{{}}`中`script`，又或者`script`中的，手动将一层一层的国际化key拷贝，粘贴。
- 就算是相同的汉子，由于在vue中的语法不同，需要重复的拷贝，粘贴
- 碰到一堆汉字拼接的简直要了老命/(ㄒoㄒ)/~~

## 快速开始

1. 安装
   （商店搜索**vue-swift-i18n**，或者ctrl+p,输入**ext install RichieChoo.vue-swift-i18n**
2. 使用，见下图：

![vue-swift-i18n](https://cdn.nlark.com/yuque/0/2020/gif/111625/1592184981019-4f136ddf-b31f-4102-9a60-8daa65aded6d.gif)

## 功能

1. 检测vue/js中的需要国际化的汉字，自动生成json文件,详情见[[传送门]](#Ne7u1)
1. 根据json文件检测vue/js,检测汉字，自动替换成步骤1生成的json 的key,详情见[[传送门]](#ypf2z)
1. 检测vue/js文件中的已替换的key，展示对应汉字提示弹窗,详情见[[传送门]](#qkRns)
1. xxx.json文件中，生成扁平化的locales的xxx_flat.json文件,方便取值复制,详情见[[传送门]](#AupC0)
1. 在vue/js中提供，提供t,tt,ttt代码提示,详情见[[传送门]](#8c0Fn)

## 设计
![design.png](https://cdn.nlark.com/yuque/0/2020/png/111625/1582165204110-151c4717-556e-443e-8975-cb29cbcbe83f.png "design")

## 详述
约定：**汉字**--`汉字开头的连续非空字符串`

### 一、Json生成，更新(Ctrl+Alt+U)

1. 汉字检索原则

- 位于`<template></template>`中的汉字，如`<span>汉字123</span>`
- 位于`<template></template>`中的标签属性的汉字，如`<span title="汉字"></span>`
- 位于`<template></template>`中的`{{`与`}}`之间的汉字，如`<span>{{test ? "汉字" : "中文" }}</span>`
- 位于`<script></script>`中的`"`与`"`之间的汉字，`'`与`'`之间的**汉字**
- 过滤单行注释
2. 生成更新Json路径配置,见[路径及JSON](#r4EQa)
3. 生成更新原则

- 当json为空或者文件不存在，将检测的**汉字**当做value，将[modulePrefix].[parents(level读取)].[当前vue文件名字]+唯一Id当做key，存储在json中
- 当json文件不为空，执行智能替换
备注：主要是防止国际化后，执行JSON生成命令误操作，会导致json数据为空或错误
- 智能替换：
i. 相同val时，新的key,val替换原来的key,val
ii. 不同val时，保存新增key,val和原有的key,val

### 二、国际化替换(Ctrl+Alt+I)

1. 替换原则
- 汉字检索原则1，**汉字123**替换为 **`{{$t('unique-key')}}`**
- 汉字检索原则2，**`title="汉字"`** 替换为 **`:title="$t('unique-key')"`**
- 汉字检索原则3，**汉字**替换为 **`$t('unique-key')`**
- 汉字检索原则4，**汉字**替换为 **`this.$t('unique-key')`**

1. 相关正则，见[传送门](https://github.com/RichieChoo/vue-swift-i18n/blob/master/utils/regex.js)
2. 替换依据Json,见[路径及JSON](#r4EQa)

### 三、国际化提示(Ctrl+Alt+O)

1. 提示原则
- 正则：`/(?<=\$t\(["'])[^'"]+/gm` 匹配已替换的字符串
- 用新生成的唯一key而不是json的key来标识，为了防止json中的key被使用多次

2. 提示依据Json,见[路径及JSON](#r4EQa)

### 四、Json扁平处理

1. 扁平化原则：
- 将所有的有value的key的所有父对象和key用`.`连接
- Json扁平处理没有提供快捷键，通过右键文件夹或者json文件来执行命令
2. 扁平依据选中json，生成/更新xxx_flat.json与json文件路径同级

### 五、路径及JSON
>根目录：认定当前项目`package.json`为根目录
>当前文件：执行Json生成等命令所在的文件

1. 路径
- 默认路径：**`[根目录]/src/locales/zh-cn.json`** 为默认json路径
- 提供字符串配置项：**`Default Locales Path`**,如"test",则对应的json路径：**`[根目录]/``test/zh-cn.json`**

2. json文件的属性名及value
- 默认：**[当前文件的父文件夹名].[当前文件名(无后缀)]**
- 提供数字层级配置项：**`Parent Dir Level`**,如**3**则代表属性名头部添加取**3**层父文件夹名
- 提供字符串配置项：`**Module Prefix Fo Update JSON**`，如 “sdm-ui”，会把“sdm-ui"添加到父文件夹名之前
- 其他配置项：
  - **`Not Alert Before Update I18n`**，默认提示，若为true则会直接更新json不弹窗提醒
  - **`Do Not Disturb`**,默认false,若为true则会关闭任何命令提醒
  - **`I18n Value Hover`**，默认true,开启悬浮提示框功能



### 六、代码提示
1. 汉字检索原则1，**`tt`** 替换为 **`{{$t('剪切板内容')}}`**
1. 汉字检索原则2，**`t`** 替换为 **`$t('剪切板内容')`**，需手动加`：`
1. 汉字检索原则3，**`t`** 替换为 **`$t('剪切板内容')`**
1. 汉字检索原则4，**`ttt`** 替换为 **`this.$t('剪切板内容')`**


## 文档及帮助

| 内容 | 文档及帮助 |
| :---: | :---: |
| 插件hello-world | [[传送门]](https://code.visualstudio.com/api/get-started/your-first-extension) |
| 插件发布流程（官方） | [[传送门]](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) |
| vscode插件官方实例 | [[传送门]](https://github.com/microsoft/vscode-extension-samples) |
| 如何检测vue文件 | [[传送门]](https://code.visualstudio.com/api/language-extensions/language-configuration-guide) |
| vscode API | [[传送门]](https://code.visualstudio.com/api/references/vscode-api) |
| vscode开发（中文） | [[传送门]](https://www.cnblogs.com/liuxianan/p/vscode-plugin-hello-world.html) |
| webstorm配置ide的live template | [[传送门]](https://www.jianshu.com/p/02a2d2c1b556) |



## 其他推荐

1. vscode正则 `[\u4e00-\u9fa5]` 查找汉字
2. vscode插件expand-region来扩展选择,方便选中复制

## TODO
- [x] 国际化json文件名可配置
- [x] 悬浮展示i18n value，跳转json文件
- [x] 通过项目配置文件获取配置 settings,其中项目配置文件优先级最高(richierc.json)
- [x] 增加puidType配置，默认使用`short`类型（12位),提供`long`类型（24位），生成唯一key
- [ ] 使用 JSON AST 代替 RegExp 优化跳转体验
- [ ] 增加 webview 展示替换更新等提醒界面
- [ ] 使用 JS AST 替换正则替换,优化中英文匹配
- [ ] 支持 JS I18n 文件写入与读取

## 赞赏
如果插件给您带来边里,欢迎star或插件赞赏哦
![star或者好评我给你返现，加我好友吧！](https://cdn.nlark.com/yuque/0/2020/png/111625/1591099372734-9be6b399-dc8e-4b2b-9313-b2f6b4c0169c.png "star或者好评我给你返现，加我好友吧！")







