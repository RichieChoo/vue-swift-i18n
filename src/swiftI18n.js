const {
    registerCommand,
    msg,
    open,
    file,
    Range,
    Position,
    ViewColumn,
} = require('../utils/vs');
const resolveEditor = require('./editor');

const defaultOption = {
    selection: new Range(new Position(0, 0), new Position(0, 0)),
    preview: false,
};

module.exports = context => {
    context.subscriptions.push(
        registerCommand('extension.vueSwiftI18n.swiftI18n', uri => {
            if (uri && uri.path) {
                open(file(uri.path), defaultOption).then(editor => {
                    if (
                        editor.document.languageId === 'vue' ||
                        editor.document.languageId === 'javascript'
                    ) {
                        resolveEditor(editor);
                    }
                });
            } else {
                msg.info(uri);
            }
        })
    );
};
