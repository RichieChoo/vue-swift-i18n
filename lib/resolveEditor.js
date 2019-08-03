const { msg, Position, Selection, Range, workspace } = require('../utils/vs');
const {
    openFileByPath,
    getCellRange,
    getRange,
    getLocales,
    changeObjeValueKey,
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

const flatten = require('flat');

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
    console.warn('lineText', text);
    return {
        lineText: text,
    };
};
module.exports = editor => {
    const lineCount = editor.document.lineCount;
    const settings = workspace.getConfiguration('vueSwiftI18n');
    const defaultLocalesPath = settings.get('defaultLocalesPath');
    const range = getRange(editor);
    const localesPath = getLocales(
        editor.document.uri.fsPath,
        defaultLocalesPath
    );
    if (!localesPath) return;
    const localeObj = changeObjeValueKey(flatten(require(localesPath)));
    const lines = [];
    for (let i = 0; i < lineCount; i++) {
        //使用text替换,getWordRangeAtPosition无法替换全部
        const line = editor.document.lineAt(i);
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
            (range.script.begin && !range.script.end && range.script.end !== 0)
        ) {
            msg.error('当前vue文件script标签不完整');
            return;
        }
        if (commentRegexp.test(lineText)) {
        } else {
            if (templateTextInAngleBracketsRegexp.test(lineText)) {
                lineData = resoloveLine({
                    lineText,
                    reg: templateTextInAngleBracketsRegexp,
                    resoloveReg: angleBracketsRegexp,
                    localeObj,
                });
            }
            if (templateTextInLineRegexp.test(lineText)) {
                lineData = resoloveLine({
                    lineText,
                    reg: templateTextInLineRegexp,
                    resoloveReg: firstSpaceRegexp,
                    localeObj,
                });
            }

            if (propertyRegexp.test(lineText)) {
                lineData = resoloveLine({
                    lineText,
                    reg: propertyRegexp,
                    resoloveReg: spaceRegexp,
                    resoloveMainReg: quotationRegexp,
                    localeObj,
                });
            }

            if (scriptRegexp.test(lineText)) {
                const isTemplate = range.template.end && i < range.template.end;
                const isScript = !range.template.end || i > range.template.end;
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
    editor.edit(editBuilder => {
        const end = new Position(lineCount + 1, 0);
        editBuilder.replace(new Range(new Position(0, 0), end), editText);
    });
};

//TODO:
//1.带标点符号的汉字正则!
//2.template下的script 替换
//3.被替换的悬浮提示原来的文字
//4.手动配置locales地址
