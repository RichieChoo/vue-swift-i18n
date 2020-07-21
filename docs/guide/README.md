# 介绍
现在前端IDE里，vscode占据大半江山（比sublime开源，比atom更快，比webstorm更轻）
[Vue-Swift-I18n](https://marketplace.visualstudio.com/items?itemName=RichieChoo.vue-swift-i18n&ssr=false#overview)是基于vscode的一个Vue项目快速国际化插件

# 它是如何工作的？

## JSON更新
通过正则匹配需要做国际化的汉字，自动制定对应unique key并更新到对应国际化JSON文件中
::: tip 为什么不用语义化的英文？
暂未找到不限次数提供翻译功能的开发平台，插件提供了批量展示释义的功能，对应的unique key也不那么显得难以维护了
:::


## 替换
根据[vue-i18n](http://kazupon.github.io/vue-i18n/)的语法，通过正则对`.vue`和`.js`的国际化汉字进行分类，使用不同的语法替换汉字对应的key到不同的位置

## 查看
根据正则匹配文件所有已经替换的i18n key，在后方展示对应含义
