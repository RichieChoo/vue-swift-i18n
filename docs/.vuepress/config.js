const fs = require("fs");
const path = require("path");
const nav = require("./nav");
module.exports = {
	title: "Vue Swift I18n",
	description: "vscode 极速国际化插件（vue-i18n）",
	head: [["link", { rel: "icon", href: "/logo.png" }]],
	themeConfig: {
		logo: "/logo.png",
		smoothScroll: true,
		nav,
		sidebar: {
			"/guide/": getAutoSideBar([
				{ title: "指南", path: "../guide", children: ["quick-starter"] },
				{
					title: "深入",
					path: "../guide",
					children: ["1-update-i18n", "2-swift-i18n", "3-show-i18n"]
				}
			]),
			"/config/": getAutoSideBar([{ title: "配置", path: "../config" }]),
			"/inspiration/": getAutoSideBar([
				{ title: "楔子", path: "../inspiration" }
			])
		}
	}
};

function getAutoSideBar(groups) {
	return groups.map((v, p) => ({
		title: v.title,
		collapsable: !!v.collapsable,
		children: [
			"",
			...fs
				.readdirSync(path.resolve(__dirname, v.path))
				.map(m => m.slice(0, -3))
				.filter(m =>
					Array.isArray(v.children) ? v.children.includes(m) : m !== "README"
				)
				.sort()
		].filter((m, n) => p === 0 || n !== 0)
	}));
}
function getGuideSidebar(groupA, groupB) {
	return [
		{
			title: groupA,
			collapsable: false,
			children: ["", "one"]
		},
		{
			title: groupB,
			collapsable: false,
			children: ["two"]
		}
	];
}
