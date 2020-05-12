const fs = require('fs');
const flatten = require('flat');
const { Range, Selection, executeCommand } = require('../utils/vs');
const { getLocales, getCustomSetting } = require('../utils');


const jump = (editor, startPos, endPos, range) => {
	const { line } = range.start;
	editor.selection = new Selection(startPos, endPos);
	executeCommand('cursorMove', {
		to: 'right',
		by: 'line',
		value: 0,
		select: true
	}).then(
		executeCommand('revealLine', {
			at: 'top',
			lineNumber: line - 5 //top方向显示五行
		})
	);
};


module.exports = (editor, i18nKeys) => {
	const keys = i18nKeys.split('.');
	keys.reverse();
	const text = editor.document.getText();
	let match, startPos, endPos, range;
	const matchArr = [ ...text.matchAll(new RegExp(keys[0], 'gm')) ];
	if (!matchArr.length) return;
	if (matchArr.length === 1) {
		match = matchArr[0];
		startPos = editor.document.positionAt(match.index);
		//因为cursor移动默认多移动一位
		endPos = editor.document.positionAt(match.index + match[0].length - 1);
		range = new Range(startPos, endPos);
		jump(editor, startPos, endPos, range);
	}
	if (matchArr.length > 1) {
		// flatten
		const defaultLocalesPath = getCustomSetting(editor.document.uri.fsPath, 'defaultLocalesPath');
		const { localesPath, exist } = getLocales({
			fsPath: editor.document.uri.fsPath,
			defaultLocalesPath,
			showError: true,
			showInfo: false
		});
		if (!exist) return;
		fs.readFile(localesPath, (err, data) => {
			if (!err) {
				const _data = JSON.stringify(flatten(JSON.parse(data.toString())), null, 2);
				let prefixArr = i18nKeys.split('.');
				prefixArr.pop();
				const prefixRegexp = new RegExp(prefixArr.join('.'), 'g');
				// @ts-ignore
				const length = [ ..._data.matchAll(prefixRegexp) ].length;
				if (length) {
					const parentMatchArr = [ ...text.matchAll(new RegExp(keys[1], 'gm')) ];
					if (parentMatchArr.length === 1) {
						const parentMatch = parentMatchArr[0];
						const lineStart = editor.document.positionAt(parentMatch.index).line;
						const lineEnd = lineStart + length + 1;
						matchArr.forEach((v) => {
							const vMatch = editor.document.positionAt(v.index);
							if (vMatch.line < lineEnd && vMatch.line > lineStart) {
								const vEndPos = editor.document.positionAt(v.index + v[0].length - 1);
								const vRange = new Range(vMatch, vEndPos);
								jump(editor, vMatch, vEndPos, vRange);
							}
						});
					}
				}
			}
		});
	}
};
