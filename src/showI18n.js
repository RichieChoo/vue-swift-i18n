const { registerCommand, msg } = require('../utils/vs');
const { openFileByPath } = require('../utils');
const updateEditor = require('../lib/updateEditor');
const { operation } = require('../utils/constant');
module.exports = context => {
    context.subscriptions.push(
        registerCommand(operation.showI18n.cmd, uri => {
            if (uri && uri.path) {
                openFileByPath(uri.path).then(editor => {
                    updateEditor({ editor, context });
                });
            } else {
                updateEditor({ context });
            }
        })
    );
};
