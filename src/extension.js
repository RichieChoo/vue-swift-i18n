const { registerCommand, msg } = require("../utils/vs");
const { plugin } = require("../utils/constant");
const swiftI18n = require("./swiftI18n");
const showI18n = require("./showI18n");
const flatJson = require("./flatJson");
const updateI18n = require("./updateI18n");
const hoverI18n = require("./hoverI18n");
const openI18nFile = require("./openI18nFile");
const generateRichieRC = require("./generateRichieRC");

function activate(context) {
	// register

	// flat json
	flatJson(context);

	// unFlat json
	flatJson(context, true);

	// i18n replace
	swiftI18n(context);

	// show i18n replace detail
	showI18n(context);

	// generate i18n json by regexp
	updateI18n(context);

	// hover show i18n detail
	hoverI18n(context);

	// jump to i18n file
	openI18nFile(context);

	// generate config file : richierc.json
	generateRichieRC(context);

	msg.info(`${plugin.name} activated`);
}
exports.activate = activate;
function deactivate() {
	msg.info(`${plugin.name} deactivated`);
}

module.exports = {
	activate,
	deactivate
};
