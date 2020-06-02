const {
	registerCommand,
	window,
	Range,
	Position,
} = require('./utils/vs');
const { operation } = require('./utils/constant');
const { openFileByPath } = require('./utils');
const scrollTo = require('./lib/scroll');
module.exports = context => {
	context.subscriptions.push(
		registerCommand(operation.openI18nFile.cmd, (args = {}) => {
			const { fPath, option, key } = args;
			const currentEditor = window.activeTextEditor;
			if (!currentEditor) return;
			const viewColumn = currentEditor.viewColumn + 1;
			openFileByPath(fPath, {
				selection: new Range(new Position(0, 0), new Position(0, 0)),
				preview: false,
				viewColumn,
			}).then(editor => {
				if(key){
					scrollTo(editor, key);
				}
			});
		})
	);
};
