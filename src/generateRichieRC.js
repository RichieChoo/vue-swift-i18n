const { registerCommand, msg } = require("../utils/vs");
const { openFileByPath } = require("../utils");
const { operation, plugin } = require("../utils/constant");
const generateRichieRC = require("../lib/generateRichieRC");
module.exports = context => {
	context.subscriptions.push(
		registerCommand(operation.generateRichieRC.cmd, uri => {
			if (uri && uri.path) {
				openFileByPath(uri.path).then(editor => {
					generateRichieRC({ editor, context });
				});
			} else {
				generateRichieRC({context})
			}
		})
	);
};
