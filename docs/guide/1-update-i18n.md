# JSON 更新

通过正则匹配需要做国际化的汉字，自动制定对应 unique key 并更新到对应国际化 JSON 文件中

## 演示

![没有什么演示能比演示图更明了的了。](/update_i18n.gif)

## 汉字检索原则

- 位于`<template></template>`中的汉字，如`<span>汉字123</span>`
- 位于`<template></template>`中的标签属性的汉字，如`<span title="汉字"></span>`
- 位于`<template></template>`中的`{{`与`}}`之间的汉字，如`<span>{{test ? "汉字" : "中文" }}</span>`
- 位于`<script></script>`中的`"`与`"`之间的汉字，`'`与`'`之间的**汉字**
- 过滤单行注释

## i18nJSON 更新路径

::: tip 约定
`root`：约定当前项目`package.json`为根目录
:::

- 默认：**`[root]/src/locales/zh-cn.json`** 为默认 json 路径，
- 当设置 **`defaultLocalesPath`** 如`test`、**`langFile`** 如`cn.json`，则对应的 i18nJSON 路径：**`[root]/test/cn.json`**

## i18nJSON 文件的 key 的外层属性名

假设文件目录为 `src/view/list/test.vue`，则对应的 json 外层如下：

```json
{
	"list": {
		"test": {
			"puidUniqueKey": "你好"
		}
	}
}
```

假如设置 **`modulePrefixFoUpdateJson`** 为 `test-module`， **`parentDirLevel`** 为 `3`，则对应的 json 外层如下：

```json
{
	"test-module": {
		"src": {
			"view": {
				"list": {
					"test": {
						"puidUniqueKey": "你好"
					}
				}
			}
		}
	}
}
```

当不需要 scope 概念时，即想把所有的 key-value 放在国际化最外层时，应该怎么办?

设置 **`notUseFileNameAsKey`** 为 `true`， **`parentDirLevel`** 为 `0`， **`fileNameSubstitute`** 为 `componentTest`，则对应的 json 外层如下：

```json
{
	"componentTest": {
		"puidUniqueKey": "你好",
	}
}
```

## i18nJSON key

::: tip 为什么不用语义化的英文？
请先看下面两张图。
:::
![图1](/unshow.png)

<p style="text-align:center">图1<p>
<br>

![图2](/show.png)
<p style="text-align:center">图2<p>
其中图1是语义化的key，图2是插件提供的批量查看key/value。相比这个功能，语义化也不那么易读呀~
