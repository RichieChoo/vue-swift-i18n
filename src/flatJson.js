const { registerCommand, msg } = require('../utils/vs');
const { plugin,operation } = require('../utils/constant');
const flat = require('../lib/flat');
module.exports = context => {
    context.subscriptions.push(
        registerCommand(operation.flatJson.cmd, uri => {
            if (uri && uri.path) {
                flat(uri);
            } else {
                msg.warn(plugin.noUri);
            }
        })
    );
};
