const { registerCommand, msg } = require("../utils/vs");
const { plugin } = require("../utils/constant");
const swiftI18n = require("./swiftI18n");
const showI18n = require("./showI18n");
const flatJson = require("./flatJson");
const updateI18n = require("./updateI18n");
const hoverI18n = require("./hoverI18n");
const openI18nFile = require("./openI18nFile");

function activate(context) {
	// 注册功能

	// 扁平化 处理 json
	flatJson(context);

	// 反扁平 处理 json
	flatJson(context, true);

	// 国际化替换
	swiftI18n(context);

	// 查看国际化替换
	showI18n(context);

	// 根据文件中文自动生成国际化json
	updateI18n(context);

	// 悬浮展示
	hoverI18n(context);

	// 跳转到国际化配置文件
	openI18nFile(context);
}
exports.activate = activate;
function deactivate() {
	msg.info(`${plugin.name} deactivated`);
}

module.exports = {
	activate,
	deactivate
};
