const {
	msg,
	Position,
	Selection,
	Range,
	window,
	workspace,
	executeCommand
} = require("../utils/vs");
const {
	openFileByPath,
	getCellRange,
	getRange,
	getLocales,
	getPrefix,
	getEditor,
	changeObjeValueKey,
	getCustomSetting,
	getValueFormPrefix,
	showMessage
} = require("../utils");
const {
	scriptRegexp,
	propertyRegexp,
	templateTextInAngleBracketsRegexp,
	templateTextInLineRegexp,
	angleBracketsRegexp,
	quotationRegexp,
	spaceRegexp,
	firstSpaceRegexp,
	commentRegexp,
	warnRegexp
} = require("../utils/regex");
const { operation } = require("../utils/constant");
const flatten = require("flat");
const fs = require("fs");

const resoloveLine = ({
	lineText,
	reg,
	resoloveReg,
	resoloveMainReg,
	localeObj,
	isScript,
	isTemplate
}) => {
	let text = lineText.replace(reg, str => {
		let temp = str;
		if (reg === propertyRegexp) {
			const prefix = temp.split("=")[0].replace(resoloveReg, " :");
			const mainStr = temp.split("=")[1].replace(resoloveMainReg, "");
			const result = localeObj[mainStr];
			if (result) {
				//$t("xx")   template下 属性替换
				return `${prefix}="$t('${result}')"`;
			}
		} else {
			const resultStr = str.replace(resoloveReg, "");
			const result = localeObj[resultStr];
			if (result) {
				//{{$t("xx")}}   template下 html替换
				if (
					reg === templateTextInAngleBracketsRegexp ||
					reg === templateTextInLineRegexp
				) {
					return "{{$t('" + result + "')}}";
				}

				if (reg === scriptRegexp) {
					//this.$t("xx")   script下 替换
					if (isScript) {
						return "this.$t('" + result + "')";
					}

					//$t("xx")   template下 {{ "汉字" }}替换
					if (isTemplate) {
						return "$t('" + result + "')";
					}
				}
			}
		}
		return str;
	});
	return {
		lineText: text
	};
};

module.exports = ({ editor, context }) => {
	let currentEditor = getEditor(editor);
	if (!currentEditor) return;

	const lineCount = currentEditor.document.lineCount;
	const defaultLocalesPath = getCustomSetting(
		currentEditor.document.uri.fsPath,
		"defaultLocalesPath"
	);
	const range = getRange(currentEditor);
	const prefix = getPrefix(currentEditor);
	const { localesPath, exist } = getLocales({
		fsPath: currentEditor.document.uri.fsPath,
		defaultLocalesPath,
		showError: true,
		showInfo: false
	});
	if (!exist) return;
	fs.readFile(localesPath, (err, data) => {
		if (!err) {
			const _data = JSON.parse(data.toString());
			const localeObj = changeObjeValueKey(
				getValueFormPrefix(_data, prefix),
				prefix
			);
			// flatten(JSON.parse(data.toString()))[prefix] || {}
			if (Object.keys(localeObj).length === 0) {
				msg.error(localesPath + ` not contains property '${prefix}'`);
				return;
			}
			const lines = [];
			for (let i = 0; i < lineCount; i++) {
				//使用text替换,getWordRangeAtPosition无法替换全部
				const line = currentEditor.document.lineAt(i);
				let lineData = {
					lineText: line.text || ""
				};
				const isTemplate = range.template.end && i < range.template.end;
				const isScript = !range.template.end || i > range.template.end;
				if (
					(!range.template.begin &&
						range.template.begin !== 0 &&
						range.template.end) ||
					(range.template.begin &&
						!range.template.end &&
						range.template.end !== 0)
				) {
					msg.error("当前vue文件template标签不完整");
					return;
				}
				if (
					(!range.script.begin &&
						range.script.begin !== 0 &&
						range.script.end) ||
					(range.script.begin && !range.script.end && range.script.end !== 0)
				) {
					msg.error("当前vue文件script标签不完整");
					return;
				}

				//过滤单行注释，多行注释不考虑
				if (!lineData.lineText.match(commentRegexp)) {
					//匹配 template ><下的汉字
					if (lineData.lineText.match(templateTextInAngleBracketsRegexp)) {
						lineData = resoloveLine({
							lineText: lineData.lineText,
							reg: templateTextInAngleBracketsRegexp,
							resoloveReg: spaceRegexp,
							localeObj
						});
					}

					//配合template range 判断 是否是template中的, warnRegexp判断是一整行 空字符开头结尾的 汉字
					if (
						lineData.lineText.match(templateTextInLineRegexp) &&
						!lineData.lineText.match(warnRegexp) &&
						isTemplate
					) {
						lineData = resoloveLine({
							lineText: lineData.lineText,
							reg: templateTextInLineRegexp,
							resoloveReg: firstSpaceRegexp,
							localeObj
						});
					}

					//匹配属性中的汉字
					if (lineData.lineText.match(propertyRegexp)) {
						lineData = resoloveLine({
							lineText: lineData.lineText,
							reg: propertyRegexp,
							resoloveReg: spaceRegexp,
							resoloveMainReg: quotationRegexp,
							localeObj
						});
					}

					//匹配script中的汉字
					if (lineData.lineText.match(scriptRegexp)) {
						lineData = resoloveLine({
							lineText: lineData.lineText,
							reg: scriptRegexp,
							resoloveReg: quotationRegexp,
							localeObj,
							isScript,
							isTemplate
						});
					}
				}
				lines.push(lineData.lineText);
			}
			const editText = lines.join("\n");
			currentEditor
				.edit(editBuilder => {
					const end = new Position(lineCount + 1, 0);
					editBuilder.replace(new Range(new Position(0, 0), end), editText);
				})
				.then(success => {
					if (success) {
						showMessage({
							message: `${operation.swiftI18n.title} success with \'${prefix}\' in ${localesPath}!`,
							needOpen: false,
							callback: {
								func: () => executeCommand(operation.showI18n.cmd),
								name: operation.showI18n.title
							}
						});
					}
				});
		}
	});
};
