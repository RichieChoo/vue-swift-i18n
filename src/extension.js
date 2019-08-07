const { registerCommand, msg } = require('../utils/vs');
const { plugin } = require('../utils/constant');
const swiftI18n = require('./swiftI18n');
const showI18n = require('./showI18n');
const flatJson = require('./flatJson');
const generateI18n = require('./generateI18n');

function activate(context) {
    flatJson(context);
    swiftI18n(context);
    showI18n(context);
    generateI18n(context);
}
exports.activate = activate;
function deactivate() {
    msg.info(`${plugin.name} deactivated`);
}

module.exports = {
    activate,
    deactivate,
};
