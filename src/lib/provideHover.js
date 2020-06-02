const fs = require("fs");
const path = require("path");
const flatten = require("flat");
const { Hover, MarkdownString } = require("../utils/vs");
const { operation } = require("../utils/constant");
const { getLocales, getCustomSetting } = require("../utils");
const { dollarTRegexp } = require("../utils/regex");

/* 获取悬浮内容 */
const getHoverMsg = (localesPath, key) => {
	let message, previous, current;
	const localesFoldPath = path.dirname(localesPath);
	const localesArr = fs.readdirSync(localesFoldPath);
	let msgArr = [];
	localesArr.forEach(item => {
		if (/\.json$/g.test(item)) {
			const itemPath = path.join(localesFoldPath, item);
			const data = fs.readFileSync(itemPath);
			const langName = path.basename(item, ".json");
			const i18nObj = !!data.toString() ? JSON.parse(data.toString()) : {};
			const localeObj = flatten(i18nObj);

			//跳转命令传参
			const name = `[\`${langName}\`](command:${
				operation.openI18nFile.cmd
			}?${encodeURIComponent(
				JSON.stringify({
					fPath: itemPath
				})
			)} "Open '${item}'")`;

			//详情跳转命令传参
			const link = localeObj[key]
				? `[${localeObj[key]}](command:${
						operation.openI18nFile.cmd
				  }?${encodeURIComponent(
						JSON.stringify({
							fPath: itemPath,
							key
						})
				  )} "Show In '${item}'")`
				: "undefined";

			const current = `* _${name}_&nbsp;&nbsp;${link}\n`;
			return msgArr.push(current);
		}
	});
	message = msgArr.join("");
	const markdown = new MarkdownString(message);
	markdown.isTrusted = true;

	return markdown;
};

/**
 * 鼠标悬停提示，当鼠标停在xxx.vue/xxx.js时，
 * 自动显示对应语言国际化的value
 * @param document The document in which the commandT was invoked.
 * @param position The position at which the command was invoked.
 * @param token A cancellation token.
 * @return A hover or a thenable that resolves to such. The lack of a result can be
 * signaled by returning `undefined` or `null`.
 */
const provideHover = (document, position, token) => {
	const lineNum = position.line;
	const lineText = document.lineAt(lineNum).text;
	const { fsPath } = document.uri;

	const { defaultLocalesPath, i18nValueHover } = getCustomSetting(fsPath, [
		"defaultLocalesPath",
		"i18nValueHover"
	]);
	const { localesPath, exist } = getLocales({
		fsPath: document.uri.fsPath,
		defaultLocalesPath,
		showInfo: false,
		showError: false
	});
	if (!exist) return;
	if (i18nValueHover) {
		const matchPosition = document.getWordRangeAtPosition(
			position,
			dollarTRegexp
		);
		if (matchPosition) {
			const i18nKey = document.getText(matchPosition);
			const msg = getHoverMsg(localesPath, i18nKey);

			return new Hover(msg);
		}
	}
};

module.exports = {
	provideHover
};
