const { registerCommand, msg } = require('../utils/vs');
const { openFileByPath } = require('../utils');
const { langArr } = require('../utils/constant');
const resolveEditor = require('../lib/resolveEditor');

module.exports = context => {
    context.subscriptions.push(
        registerCommand('extension.vueSwiftI18n.swiftI18n', uri => {
            console.warn('context',context.decorationTypes);
            if (uri && uri.path) {
                openFileByPath(uri.path).then(editor => {
                    if (langArr.includes(editor.document.languageId)) {
                        resolveEditor(editor);
                    }
                });
            } else {
                msg.info(uri);
            }
        })
    );
};
