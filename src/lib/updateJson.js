const {
	openFileByPath,
	getPrefix,
	getLocales,
	getValueFromDotString,
	getEditor,
	showMessage,
	getCustomSetting
} = require("../utils");
const {  operation } = require("../utils/constant");
const unflatten = require("unflatten");
const fs = require("fs");
const path = require("path");
const mkdir = require("mkdirp");
const retrieveCN = require("../utils/retrieveCN");
const {
	msg,
	Position,
	Range,
} = require("../utils/vs");

const tipBeforeWriteJson = (currentEditor, localesPath) => {
	const { notAlertBeforeUpdateI18n, puidType } = getCustomSetting(
		currentEditor.document.uri.fsPath,
		["notAlertBeforeUpdateI18n", "puidType"]
	);
	if (notAlertBeforeUpdateI18n) {
		writeJson(currentEditor, localesPath, puidType);
	} else {
		msg
			.info(
				`${operation.updateI18n.title} will update the key which has same value in: \n${localesPath}`,
				{ modal: true },
				"OK", //此处的顺序位置 对应 enter的响应
				"View it"
			)
			.then(result => {
				if (result === "View it") {
					openFileByPath(localesPath, {
						selection: new Range(new Position(0, 0), new Position(0, 0)),
						preview: false,
						viewColumn: currentEditor.viewColumn + 1
					});
				}
				if (result === "OK") {
					writeJson(currentEditor, localesPath, puidType);
				}
			});
	}
};
const writeJson = (currentEditor, localesPath, puidType) => {
	const linesObj = retrieveCN(currentEditor, puidType);
	const prefix = getPrefix(currentEditor);
	fs.readFile(localesPath, (err, data) => {
		let _data;
		if (err) {
			_data = {};
		} else {
			_data = !data.toString() ? {} : JSON.parse(data.toString());
		}
		let temp = getValueFromDotString(_data, prefix);
		if (Object.keys(linesObj).length !== 0) {
			//已存在 => 智能替换（1.相同val时，新的key,val替换原来的key,val。2.不同val时，保存新增key,val和原有的key,val,）
			Object.keys(linesObj).forEach(v => {
				if (!temp || Object.keys(temp).length === 0) {
					_data[prefix] = linesObj;
				} else {
					Object.keys(temp).forEach(p => {
						if (temp[p] === linesObj[v]) {
							delete temp[p];
							temp[v] = linesObj[v];
						} else {
							temp[v] = linesObj[v];
						}
					});
					_data[prefix] = temp;
				}
			});
		} else {
			showMessage({
				message: "There are no Chinese match in :",
				file: localesPath,
				needOpen: false
			});
			return;
		}
		let str = JSON.stringify(unflatten(_data), null, 4);
		fs.writeFile(localesPath, str, err => {
			if (!err) {
				showMessage({
					message: `${operation.updateI18n.title} Success : ${localesPath}`,
					file: localesPath,
					editor: currentEditor
				});
			}
		});
	});
};

module.exports = ({ editor, context }) => {
	let currentEditor = getEditor(editor);
	if (!currentEditor) return;
	const defaultLocalesPath = getCustomSetting(
		currentEditor.document.uri.fsPath,
		"defaultLocalesPath"
	);
	const { localesPath, exist } = getLocales({
		fsPath: currentEditor.document.uri.fsPath,
		defaultLocalesPath,
		showError: false,
		showInfo: false
	});
	if (!exist) {
		mkdir(path.dirname(localesPath), () => {
			tipBeforeWriteJson(currentEditor, localesPath);
		});
	} else {
		tipBeforeWriteJson(currentEditor, localesPath);
	}
};
