const { registerCommand, msg } = require('../utils/vs');
const { plugin } = require('../lib/constant');
const swiftI18n = require('./swiftI18n');
const flatJson = require('./flatJson');

function activate(context) {
    flatJson(context);
    swiftI18n(context);
}
exports.activate = activate;
function deactivate() {
    msg.info(`${plugin.name} deactivated`);
}

module.exports = {
    activate,
    deactivate,
};
