const { getEditor, showMessage } = require('../utils');
const { Position, Range, Selection, executeCommand } = require('../utils/vs');
module.exports = (editor, key) => {
	const text = editor.document.getText();
	const position = new Position(434, 1);
	const reg = new RegExp(key, 'gm');
	let match, startPos, endPos, range;
	while ((match = reg.exec(text)) !== null) {
		startPos = editor.document.positionAt(match.index);
		//因为cursor移动默认多移动一位
		endPos = editor.document.positionAt(match.index + match[0].length - 1);
		range = new Range(startPos, endPos);
	}
	const { line, character } = range.start;
	editor.selection = new Selection(startPos, endPos);
	executeCommand('cursorMove', {
		to: 'right',
		by: 'line',
		value: 0,
		select: true,
	}).then(
		executeCommand('revealLine', {
			at: 'top',
			lineNumber: line - 5,//top方向显示五行
		})
	);
};
