const { registerCommand, msg } = require('../utils/vs');
const { plugin } = require('../lib/constant');
const flat = require('../lib/flat');
module.exports = context => {
    context.subscriptions.push(
        registerCommand('extension.vueSwiftI18n.flatJson', uri => {
            if (uri && uri.path) {
                flat(uri);
            } else {
                msg.warn(plugin.noUri);
            }
        })
    );
};
