const { registerCommand } = require('./utils/vs');
const { openFileByPath } = require('./utils');
const showJson = require('./lib/showJson');
const { operation } = require('./utils/constant');
module.exports = (context) => {
	context.subscriptions.push(
		registerCommand(operation.showI18n.cmd, (uri) => {
			if (uri && uri.path) {
				openFileByPath(uri.path).then((editor) => {
					showJson({ editor, context });
				});
			} else {
				showJson({ context });
			}
		})
	);
};
