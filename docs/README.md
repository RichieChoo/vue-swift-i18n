---
home: true
heroImage: /logo.png
actionText: 快速上手 →
actionLink: /guide/
features:
- title: 快速生成i18n文件
  details: 通过正则检测中文，快速产出json文件到对应国际化目录
- title: 极速替换
  details: 通过检测中文在vue文件位置，使用相应的vue及vue-i18n语法快速替换中文
- title: 便捷展示
  details: 极速展示vue文件对应国际化前的含义（现仅支持中文）
footer: MIT Licensed | Copyright © 2019-present Richie Choo
---

像数 1, 2, 3, 4, 5 一样容易 :wink:

``` bash
# 安装
ext install RichieChoo.vue-swift-i18n

# 使用idea打开vue项目的一个.vue文件

# 生成/更新i18n json 文件
Ctrl + Alt + U #Ctrl+Cmd+U

# 替换vue中需要国际化的汉字
Ctrl + Alt + I #Ctrl+Cmd+I

# 查看已经替换的i18n对应值
Ctrl + Alt + O #Ctrl+Cmd+O

```
::: warning 注意
请确保你的 Vscode 版本 >= 1.37。
:::
