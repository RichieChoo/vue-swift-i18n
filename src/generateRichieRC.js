const { registerCommand } = require('./utils/vs');
const { openFileByPath } = require('./utils');
const { operation } = require('./utils/constant');
const generateRichieRC = require('./lib/generateRichieRC');
module.exports = (context) => {
	context.subscriptions.push(
		registerCommand(operation.generateRichieRC.cmd, (uri) => {
			if (uri && uri.path) {
				openFileByPath(uri.path).then((editor) => {
					generateRichieRC({ editor, context });
				});
			} else {
				generateRichieRC({ context });
			}
		})
	);
};
