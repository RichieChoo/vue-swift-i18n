const { registerCommand } = require('./utils/vs');
const { openFileByPath } = require('./utils');
const { operation } = require('./utils/constant');
const updateJson = require('./lib/updateJson');
module.exports = context => {
    context.subscriptions.push(
        registerCommand(operation.updateI18n.cmd, uri => {
            if (uri && uri.path) {
                openFileByPath(uri.path).then(editor => {
                    updateJson({ editor, context });
                });
            } else {
                updateJson({ context });
            }
        })
    );
};
