const { registerCommand, msg } = require('../utils/vs');
const { openFileByPath } = require('../utils');
const { operation } = require('../utils/constant');
const generateJson = require('../lib/generateJson');
module.exports = context => {
    context.subscriptions.push(
        registerCommand(operation.generateI18n.cmd, uri => {
            if (uri && uri.path) {
                openFileByPath(uri.path).then(editor => {
                    generateJson({ editor, context });
                });
            } else {
                generateJson({ context });
            }
        })
    );
};
