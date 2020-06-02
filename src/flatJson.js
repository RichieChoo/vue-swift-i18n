const { registerCommand, msg } = require("./utils/vs");
const { plugin, operation } = require("./utils/constant");
const flat = require("./lib/flat");
module.exports = (context, unFlat = false) => {
	context.subscriptions.push(
		registerCommand(
			unFlat ? operation.unFlatJson.cmd : operation.flatJson.cmd,
			uri => {
				if (uri && uri.path) {
					flat(uri, unFlat);
				} else {
					msg.warn(plugin.noUri);
				}
			}
		)
	);
};
