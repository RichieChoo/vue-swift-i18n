const {
	openFileByPath,
	getPrefix,
	getRange,
	getLocales,
	getValueFormPrefix,
	getEditor,
	showMessage,
	getCustomSetting
} = require("../utils");
const {
	customConfigFileName,
	operation,
	defaultConfig
} = require("../utils/constant");
const flatten = require("flat");
const fs = require("fs");
const path = require("path");

const {
	msg,
	Position,
	Selection,
	Range,
	workspace,
	window,
	OverviewRulerLane
} = require("../utils/vs");
const sortJson = require("sort-json");

const writeData = (fsPath, data, currentEditor) => {
	fs.writeFile(fsPath, data, err => {
		if (!err) {
			showMessage({
				message: `${operation.generateRichieRC.title} Success : ${fsPath}`,
				file: fsPath,
				editor: currentEditor
			});
		}
	});
};
module.exports = ({ editor, context }) => {
	let currentEditor = getEditor(editor);
	if (!currentEditor) return;
	const rootPath = getLocales({
		fsPath: currentEditor.document.uri.fsPath,
		isGetRootPath: true
	});
	const fsPath = path.join(rootPath, customConfigFileName);
	const callback = () => {
		msg
			.info(
				`Whether to read the local vscode setting to generate 'richierc.json' ( highest priority) file?`,
				{ modal: true },
				"No, use default",
				"Yes, read my setting"
			)
			.then(result => {
				if (result === "Cancel") return;

				if (result === "No, use default") {
					let data = JSON.stringify(sortJson(defaultConfig), null, 2);
					writeData(fsPath, data, currentEditor);
				}
				if (result === "Yes, read my setting") {
					const customSetting = getCustomSetting(
						currentEditor.document.uri.fsPath,
						Object.keys(defaultConfig),
						true
					);
					let data = JSON.stringify(sortJson(customSetting), null, 2);
					writeData(fsPath, data, currentEditor);
				}
			});
	};
	if (fs.existsSync(fsPath)) {
		showMessage({
			message: `File '${fsPath}' is already exists`,
			file: fsPath,
			editor: currentEditor,
			callback: {
				name: "Overwrite it",
				func: callback
			}
		});
	} else {
		callback();
	}
};
