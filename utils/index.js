const fs = require("fs");
const validator = require("validator");
const {
	registerCommand,
	executeCommand,
	msg,
	open,
	file,
	Range,
	Position,
	ViewColumn,
	workspace,
	window
} = require("./vs");
const {
	templateBeginRegexp,
	templateEndRegexp,
	scriptBeginRegexp,
	scripteEndRegexp
} = require("./regex");
const {
	langArr,
	operation,
	customConfigFileName,
	pkgFileName
} = require("./constant");
const path = require("path");
const settings = workspace.getConfiguration("vueSwiftI18n");
const connect = require("./connect");
const isObject = obj =>
	Object.prototype.toString.call(obj) === "[object Object]";
const getCustomSettingKey = (customSetting, key) =>
	customSetting.hasOwnProperty(key) ? customSetting[key] : settings.get(key);

const showMessage = ({
	type = "info",
	message,
	file,
	editor,
	callback,
	needOpen = true
}) => {
	const doNotDisturb = settings.get("doNotDisturb"); //此配置在richierc.json无效
	if (doNotDisturb && type === "info") return;

	const actions = [
		"Got it",
		callback && callback.name,
		needOpen && "View it"
	].filter(v => !!v);

	const vsMsg = type === "error" ? msg.error : msg.info;

	const viewColumn = editor
		? editor.viewColumn + 1
		: getEditor(editor)
		? getEditor(editor).viewColumn + 1
		: 1;

	vsMsg(message, ...actions).then(val => {
		if (val === "View it") {
			openFileByPath(file, {
				selection: new Range(new Position(0, 0), new Position(0, 0)),
				preview: false,
				viewColumn
			});
		}
		if (callback && val === callback.name) {
			callback.func();
		}
	});
};

//获取配置项
const getCustomSetting = (fsPath, key) => {
	const dirName = path.dirname(fsPath);
	if (fs.existsSync(path.join(dirName, pkgFileName))) {
		const customPath = path.join(dirName, customConfigFileName);
		if (fs.existsSync(customPath)) {
			const data = fs.readFileSync(customPath);
			let customSetting = validator.isJSON(data.toString())
				? JSON.parse(data.toString())
				: {};
			if (!validator.isJSON(data.toString())) {
				showMessage({
					type: "error",
					file: customPath,
					message: `'${customPath}' is not a right json, custom setting will not work`
				});
			}
			if (typeof key === "string") {
				return getCustomSettingKey(customSetting, key);
			}
			if (Array.isArray(key)) {
				return key.reduce((p, c) => {
					p[c] = getCustomSettingKey(customSetting, c);
					return p;
				}, {});
			}
			if (isObject(key)) {
				for (const i in key) {
					if (key.hasOwnProperty(i)) {
						key[i] = getCustomSettingKey(customSetting, key[i]);
					}
				}
				return key;
			}
		}
		return {};
	} else {
		return getCustomSetting(dirName, key);
	}
};

const getPrefix = currentEditor => {
	const fileName =
		currentEditor.document.languageId === "vue"
			? path.basename(currentEditor.document.uri.fsPath, ".vue")
			: path.basename(currentEditor.document.uri.fsPath, ".js");
	const { modulePrefix, jsonNameLevel = 0 } = getCustomSetting(
		currentEditor.document.uri.fsPath,
		{
			modulePrefix: "modulePrefixFoUpdateJson",
			jsonNameLevel: "parentDirLevel"
		}
	);
	let prefix = connect(
		path
			.dirname(currentEditor.document.uri.fsPath)
			.split(path.sep)
			.slice(-jsonNameLevel)
			.join("."),
		fileName
	);
	if (modulePrefix) {
		prefix = connect(modulePrefix, prefix);
	}
	return prefix;
};

const defaultOption = {
	selection: new Range(new Position(0, 0), new Position(0, 0)),
	preview: false
};
const openFileByPath = (fPath, option) => {
	return open(file(fPath), option || defaultOption);
};

const getCellRange = ({ editor, regex, line, lineEnd }) =>
	editor.document.getWordRangeAtPosition(new Position(line, lineEnd), regex);

const getRange = editor => {
	const range = {
		template: {},
		script: {}
	};
	const lineCount = editor.document.lineCount;
	for (let i = 0; i < lineCount; i++) {
		const line = editor.document.lineAt(i);
		const tBegin = getCellRange({
			editor,
			regex: templateBeginRegexp,
			line: i,
			lineEnd: line.range.end.character
		});
		const tEnd = getCellRange({
			editor,
			regex: templateEndRegexp,
			line: i,
			lineEnd: line.range.end.character
		});
		const sBegin = getCellRange({
			editor,
			regex: scriptBeginRegexp,
			line: i,
			lineEnd: line.range.end.character
		});
		const sEnd = getCellRange({
			editor,
			regex: scripteEndRegexp,
			line: i,
			lineEnd: line.range.end.character
		});
		if (tBegin) {
			range.template.begin = tBegin.start.line;
		} else if (tEnd) {
			range.template.end = tEnd.start.line;
		}
		if (sBegin) {
			range.script.begin = sBegin.start.line;
		} else if (sEnd) {
			range.script.end = sEnd.start.line;
		}
	}
	return range;
};
const getEditor = editor => {
	let currentEditor = editor || window.activeTextEditor;
	const stopFlag =
		!currentEditor || !langArr.includes(currentEditor.document.languageId);
	if (stopFlag) return false;
	return currentEditor;
};

const varifyFile = ({ fsPath, showError, showInfo }) => {
	let exist = false;
	if (!fs.existsSync(fsPath)) {
		//TODO: 跳转到国际化设置路径!
		showError &&
			showMessage({
				type: "error",
				message: `Not Found File:${fsPath}`,
				needOpen: false,
				callback: {
					name: operation.updateI18n.title,
					func: () => executeCommand(operation.updateI18n.cmd)
				}
			});
	} else {
		showInfo &&
			showMessage({
				message: `Get Locales Path:${fsPath}`,
				file: fsPath
			});
		exist = true;
	}
	return { localesPath: fsPath, exist };
};
const getLocales = ({
	fsPath,
	defaultLocalesPath,
	showInfo = false,
	showError = true
}) => {
	const dirName = path.dirname(fsPath);
	if (fs.existsSync(path.join(dirName, pkgFileName))) {
		const lang = getCustomSetting(path.join(dirName, pkgFileName), "langFile"); //default "zh-cn.json"
		let jsonPath = path.join(dirName, "src", "locales", lang);
		if (!!defaultLocalesPath) {
			jsonPath = path.join(dirName, defaultLocalesPath, lang);
		}
		return varifyFile({ fsPath: jsonPath, showInfo, showError });
	} else {
		return getLocales({
			fsPath: dirName,
			defaultLocalesPath,
			showInfo,
			showError
		});
	}
};
const changeObjeValueKey = (obj, prefix) => {
	const result = {};
	Object.keys(obj).forEach(v => {
		if (!result[obj[v]]) {
			result[obj[v]] = connect(prefix, v);
		}
	});
	return result;
};

const getValueFormPrefix = (_data, prefix) => {
	let result = {};
	const str = prefix
		.split(".")
		.map((v, p) => `["${v}"]`)
		.join("");
	try {
		eval(`result = _data${str}`);
	} catch (error) {
		result = {};
	}
	return result;
};

module.exports = {
	openFileByPath,
	getCellRange,
	getRange,
	getLocales,
	changeObjeValueKey,
	getEditor,
	showMessage,
	connect,
	getPrefix,
	getValueFormPrefix,
	getCustomSetting
};
