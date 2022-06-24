# Vue i18n

[![](https://vsmarketplacebadge.apphb.com/version/RichieChoo.vue-swift-i18n.svg)](https://marketplace.visualstudio.com/items?itemName=RichieChoo.vue-swift-i18n)
[![](https://vsmarketplacebadge.apphb.com/installs-short/RichieChoo.vue-swift-i18n.svg)](https://marketplace.visualstudio.com/items?itemName=RichieChoo.vue-swift-i18n)
[![](https://vsmarketplacebadge.apphb.com/downloads-short/RichieChoo.vue-swift-i18n.svg)](https://marketplace.visualstudio.com/items?itemName=RichieChoo.vue-swift-i18n)
[![](https://vsmarketplacebadge.apphb.com/rating-short/RichieChoo.vue-swift-i18n.svg)](https://marketplace.visualstudio.com/items?itemName=RichieChoo.vue-swift-i18n)
[![](https://vsmarketplacebadge.apphb.com/trending-monthly/RichieChoo.vue-swift-i18n.svg)](https://marketplace.visualstudio.com/items?itemName=RichieChoo.vue-swift-i18n)


## ✨ 快速开始
![vue-swift-i18n](swift.gif)

## 契子

现有项目国际化非常的繁琐:

1. 将所有出现的要国际化的汉字复制取名配置
1. 在 vue/js 文件中找到汉字位置，区分是在`template`中标签的`label`或者其他`property`中，或者`{{}}`中`script`，又或者`script`中的，手动将一层一层的国际化 key 拷贝，粘贴。
1. 就算是相同的汉子，由于在 vue 中的语法不同，需要重复的拷贝，粘贴
1. 碰到一堆汉字拼接的简直要了老命/(ㄒ o ㄒ)/~~

## 设计

![design.png](https://cdn.nlark.com/yuque/0/2020/png/111625/1582165204110-151c4717-556e-443e-8975-cb29cbcbe83f.png "design")

## 插件功能

1. 检测 vue/js 中的需要国际化的汉字，自动生成 json 文件
1. 根据 json 文件检测 vue/js,检测汉字，自动替换成步骤 1 生成的 json 的 key
1. 检测 vue/js 文件中的已替换的 key，展示对应汉字提示弹窗
1. xxx.json 文件中，生成扁平化的 locales 的 xxx_flat.json 文件,方便取值复制
1. 在 vue/js 中提供，提供 t,tt,ttt 代码提示

## TODO

- [x] 国际化 json 文件名可配置
- [x] 悬浮展示 i18n value，跳转 json 文件
- [x] 通过项目配置文件获取配置 settings,其中项目配置文件优先级最高(richierc.json)
- [x] 增加 puidType 配置，默认使用`short`类型（12 位),提供`long`类型（24 位），生成唯一 key
- [x] 使用 JSON AST 代替 RegExp 优化跳转体验
- [ ] 增加 webview 展示替换更新等提醒界面
- [ ] 支持 JS I18n 文件写入与读取

## 赞赏

如果插件给您带来便利,欢迎 star 或 赞赏哦
![star或者好评我给你返现，加我好友吧！](https://cdn.nlark.com/yuque/0/2020/png/111625/1591099372734-9be6b399-dc8e-4b2b-9313-b2f6b4c0169c.png "star或者好评我给你返现，加我好友吧！")
