const { registerCommand, msg } = require('../utils/vs');
const { openFileByPath } = require('../utils');
const updateEditor = require('../lib/updateEditor');
const { plugin } = require('../lib/constant');
module.exports = context => {
    context.subscriptions.push(
        registerCommand('extension.vueSwiftI18n.showI18n', uri => {
            if (uri && uri.path) {
                openFileByPath(uri.path).then(editor=>{
                    if (
                        editor.document.languageId === 'vue' ||
                        editor.document.languageId === 'javascript'
                    ) {
                        updateEditor(editor);
                    }
                })
            } else {
                updateEditor();
            }
        })
    );
};
