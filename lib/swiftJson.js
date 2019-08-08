const {
    msg,
    Position,
    Selection,
    Range,
    window,
    workspace,
    executeCommand,
} = require('../utils/vs');
const {
    openFileByPath,
    getCellRange,
    getRange,
    getLocales,
    getEditor,
    changeObjeValueKey,
    showMessage,
} = require('../utils');
const {
    scriptRegexp,
    propertyRegexp,
    templateTextInAngleBracketsRegexp,
    templateTextInLineRegexp,
    angleBracketsRegexp,
    quotationRegexp,
    spaceRegexp,
    firstSpaceRegexp,
    commentRegexp,
} = require('../utils/regex');
const { operation } = require('../utils/constant');
const flatten = require('flat');
const fs = require('fs');

const resoloveLine = ({
    lineText,
    reg,
    resoloveReg,
    resoloveMainReg,
    localeObj,
    isScript,
    isTemplate,
}) => {
    let text = lineText.replace(reg, str => {
        if (reg === propertyRegexp) {
            const prefix = str.split('=')[0].replace(resoloveReg, ' :');
            const mainStr = str.split('=')[1].replace(resoloveMainReg, '');
            const result = localeObj[mainStr];
            if (result) {
                //$t("xx")   template下 属性替换
                return `${prefix}="$t('${result}')"`;
            }
        } else {
            const resultStr = str.replace(resoloveReg, '');
            const result = localeObj[resultStr];
            if (result) {
                //{{$t("xx")}}   template下 html替换
                if (reg === templateTextInAngleBracketsRegexp) {
                    return ">{{$t('" + result + "')}}<";
                }
                if (reg === templateTextInLineRegexp) {
                    return "{{$t('" + result + "')}}";
                }

                if (reg === scriptRegexp) {
                    //this.$t("xx")   script下 替换
                    if (isScript) {
                        return "this.$t('" + result + "')";
                    }

                    //$t("xx")   template下 {{ "汉字" }}替换
                    if (isTemplate) {
                        return "$t('" + result + "')";
                    }
                }
            }
        }
        return str;
    });
    return {
        lineText: text,
    };
};
module.exports = ({ editor, context }) => {
    let currentEditor = getEditor(editor);
    if (!currentEditor) return;

    const lineCount = currentEditor.document.lineCount;
    const settings = workspace.getConfiguration('vueSwiftI18n');
    const defaultLocalesPath = settings.get('defaultLocalesPath');
    const range = getRange(currentEditor);
    const { localesPath, exist } = getLocales({
        fsPath: currentEditor.document.uri.fsPath,
        defaultLocalesPath,
        showError: true,
        showInfo: false,
    });
    if (!exist) return;
    fs.readFile(localesPath, (err, data) => {
        if (!err) {
            const localeObj = changeObjeValueKey(
                flatten(JSON.parse(data.toString()))
            );
            const lines = [];
            for (let i = 0; i < lineCount; i++) {
                //使用text替换,getWordRangeAtPosition无法替换全部
                const line = currentEditor.document.lineAt(i);
                let lineData = {
                    lineText: line.text || '',
                };
                let { lineText } = lineData;
                if (
                    (!range.template.begin &&
                        range.template.begin !== 0 &&
                        range.template.end) ||
                    (range.template.begin &&
                        !range.template.end &&
                        range.template.end !== 0)
                ) {
                    msg.error('当前vue文件template标签不完整');
                    return;
                }
                if (
                    (!range.script.begin &&
                        range.script.begin !== 0 &&
                        range.script.end) ||
                    (range.script.begin &&
                        !range.script.end &&
                        range.script.end !== 0)
                ) {
                    msg.error('当前vue文件script标签不完整');
                    return;
                }
                if (lineText.match(commentRegexp)) {
                    console.warn('lineText',lineText);
                } else {
                    if (lineText.match(templateTextInAngleBracketsRegexp)) {
                        lineData = resoloveLine({
                            lineText,
                            reg: templateTextInAngleBracketsRegexp,
                            resoloveReg: angleBracketsRegexp,
                            localeObj,
                        });
                    }
                    if (lineText.match(templateTextInLineRegexp)) {
                        lineData = resoloveLine({
                            lineText,
                            reg: templateTextInLineRegexp,
                            resoloveReg: firstSpaceRegexp,
                            localeObj,
                        });
                    }

                    if (lineText.match(propertyRegexp)) {
                        lineData = resoloveLine({
                            lineText,
                            reg: propertyRegexp,
                            resoloveReg: spaceRegexp,
                            resoloveMainReg: quotationRegexp,
                            localeObj,
                        });
                    }

                    if (lineText.match(scriptRegexp)) {
                        const isTemplate =
                            range.template.end && i < range.template.end;
                        const isScript =
                            !range.template.end || i > range.template.end;
                        lineData = resoloveLine({
                            lineText,
                            reg: scriptRegexp,
                            resoloveReg: quotationRegexp,
                            localeObj,
                            isScript,
                            isTemplate,
                        });
                    }
                }
                lines.push(lineData.lineText);
            }
            const editText = lines.join('\n');
            currentEditor
                .edit(editBuilder => {
                    const end = new Position(lineCount + 1, 0);
                    editBuilder.replace(
                        new Range(new Position(0, 0), end),
                        editText
                    );
                })
                .then(success => {
                    if (success) {
                        showMessage({
                            message: `${operation.swiftI18n.title} success with : ${localesPath}!`,
                            needOpen:false,
                            callback: {
                                func: () =>
                                    executeCommand(operation.showI18n.cmd),
                                name: operation.showI18n.title,
                            },
                        });
                    }
                });
        }
    });
};
