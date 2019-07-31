const { msg, Position, Range } = require('../utils/vs');

//匹配属性或者js中的汉字
const scriptRegexp = /["|'][\u4e00-\u9fa5]+["|']/g;
// 后行否定断言  和  正向否定查找 匹配 template下的汉字
const templateRegexp = /(?<!["|'])[\u4e00-\u9fa5]+(?!["|'])/g;

module.exports = editor => {
    const lineCount = editor.document.lineCount;
    console.warn('editor.document.lineAt(0)',editor.document.lineAt(0));
    for (let i = 0; i < lineCount; i++) {
        const line = editor.document.lineAt(i);
        const temp = editor.document.getWordRangeAtPosition(
            new Position(i, line.range.end.character),
            templateRegexp
        );
        temp && console.warn(temp)
        // if (temp) {
        //     console.warn('i',i);
        //     editor.edit(editBuilder=> {
        //         editBuilder.replace(new Range(new Position(i, temp.start.character),new Position(i, temp.end.character)), 'tt');
        //     });
        // }
    }
    // const firstLine = editor.document.lineAt(0);
    // const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
    // const textRange = new Range(
    //     0,
    //     firstLine.range.start.character,
    //     editor.document.lineCount - 1,
    //     lastLine.range.end.character
    // );
    // editor.edit(function(editBuilder) {
    //     editBuilder.replace(textRange, 'tt');
    // });
};
