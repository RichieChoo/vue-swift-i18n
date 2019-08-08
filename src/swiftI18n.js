const { registerCommand, msg } = require('../utils/vs');
const { openFileByPath } = require('../utils');
const { operation } = require('../utils/constant');
const swiftJson = require('../lib/swiftJson');

module.exports = context => {
    context.subscriptions.push(
        registerCommand(operation.swiftI18n.cmd, uri => {
            if (uri && uri.path) {
                openFileByPath(uri.path).then(editor => {
                    swiftJson({ editor, context });
                });
            } else {
                swiftJson({ context });
            }
        })
    );
};
