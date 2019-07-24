const {
    registerCommand,
    msg,
    open,
    file,
    Range,
    Position,
    ViewColumn,
} = require('../utils/vs');
const option = {
    selection: new Range(new Position(4, 0), new Position(4, 1000)),
    preview: false,
};
module.exports = context => {
    context.subscriptions.push(
        registerCommand('extension.vueSwiftI18n.swiftI18n', uri => {
            if (uri && uri.path) {
                open(file(uri.path), option).then(editor=>{
                    if(editor.document.languageId==="vue"){
                        console.warn('typeof',typeof editor.document.getWordRangeAtPosition());
                        console.warn('editor.document', editor.document.getWordRangeAtPosition(new Position(5,999),/"[\u4e00-\u9fa5]+"|\>[\u4e00-\u9fa5]+\</));
                    }
                });
            } else {
                msg.info(uri);
            }
        })
    );
};
