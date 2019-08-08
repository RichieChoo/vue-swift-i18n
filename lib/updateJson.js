const { dollarTRegexp } = require('../utils/regex');
const {
    openFileByPath,
    getPrefix,
    getRange,
    getLocales,
    getEditor,
    showMessage,
} = require('../utils');
const { langArr, operation } = require('../utils/constant');
const flatten = require('flat');
const fs = require('fs');
const path = require('path');
const mkdir = require('mkdirp');
const findParentDir = require('find-parent-dir');
const Puid = require('puid');
const puid = new Puid();
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

const {
    msg,
    Position,
    Selection,
    Range,
    workspace,
    window,
    OverviewRulerLane,
} = require('../utils/vs');

const getLineCnWord = ({ lineText, reg, resoloveReg }) => {
    let word = lineText.match(reg);
    if (Array.isArray(word) && word.length > 0) {
        word = word.map(v => {
            return reg === propertyRegexp
                ? v.split('=')[1].replace(resoloveReg, '')
                : v.replace(resoloveReg, '');
        });
    }
    return word;
};

const getlinesObj = arr =>
    arr.reduce((p, c) => {
        const id = puid.generate();
        p[id] = c;
        return p;
    }, {});

const tipBeforeWriteJson = (currentEditor, localesPath) => {
    const settings = workspace.getConfiguration('vueSwiftI18n');
    const notAlertBeforeUpdateI18n = settings.get('notAlertBeforeUpdateI18n');
    if (notAlertBeforeUpdateI18n) {
        writeJson(currentEditor, localesPath);
    } else {
        msg.info(
            `${
                operation.updateI18n.title
            } will cover the key which has same value in: \n${localesPath}`,
            { modal: true },
            'OK', //此处的顺序位置 对应 enter的响应
            'View it'
        ).then(result => {
            if (result === 'View it') {
                openFileByPath(localesPath, {
                    selection: new Range(
                        new Position(0, 0),
                        new Position(0, 0)
                    ),
                    preview: false,
                    viewColumn: currentEditor.viewColumn + 1,
                });
            }
            if (result === 'OK') {
                writeJson(currentEditor, localesPath);
            }
        });
    }
};
const writeJson = (currentEditor, localesPath) => {
    const lineCount = currentEditor.document.lineCount;
    const range = getRange(currentEditor);
    const prefix = getPrefix(currentEditor);
    const lines = [];
    for (let i = 0; i < lineCount; i++) {
        //使用text替换,getWordRangeAtPosition无法替换全部
        const lineText = currentEditor.document.lineAt(i).text;
        let cnWordArr = [];
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
        if (lineText.match(commentRegexp)) {
            // console.warn('lineText',lineText);
        } else {
            if (lineText.match(templateTextInAngleBracketsRegexp)) {
                cnWordArr = getLineCnWord({
                    lineText,
                    reg: templateTextInAngleBracketsRegexp,
                    resoloveReg: angleBracketsRegexp,
                });
            }
            if (lineText.match(templateTextInLineRegexp)) {
                cnWordArr = getLineCnWord({
                    lineText,
                    reg: templateTextInLineRegexp,
                    resoloveReg: firstSpaceRegexp,
                });
            }

            if (lineText.match(propertyRegexp)) {
                cnWordArr = getLineCnWord({
                    lineText,
                    reg: propertyRegexp,
                    resoloveReg: quotationRegexp,
                });
            }

            if (lineText.match(scriptRegexp)) {
                cnWordArr = getLineCnWord({
                    lineText,
                    reg: scriptRegexp,
                    resoloveReg: quotationRegexp,
                });
            }
        }
        cnWordArr.length > 0 && lines.push(...cnWordArr);
    }
    const linesObj = getlinesObj(lines);
    fs.readFile(localesPath, (err, data) => {
        let _data = err || !data.toString() ? {} : JSON.parse(data.toString());

        if (!_data[prefix] || Object.keys(_data[prefix]).length === 0) {
            //空对象或者不存在 => 全部替换
            _data[prefix] = linesObj;
        } else {
            //已存在 => 智能替换（1.相同val时，新的key,val替换原来的key,val。2.不同val时，保存新增key,val和原有的key,val,）
            Object.keys(linesObj).forEach(v => {
                Object.keys(_data[prefix]).forEach(p => {
                    if (_data[prefix][p] === linesObj[v]) {
                        delete _data[prefix][p];
                        _data[prefix][v] = linesObj[v];
                    } else {
                        _data[prefix][v] = linesObj[v];
                    }
                });
            });
        }

        let str = JSON.stringify(_data, null, 4);
        fs.writeFile(localesPath, str, err => {
            if (!err) {
                showMessage({
                    message: `${
                        operation.updateI18n.title
                    } Success : ${localesPath}`,
                    file: localesPath,
                    editor: currentEditor,
                });
            }
        });
    });
};

module.exports = ({ editor, context }) => {
    let currentEditor = getEditor(editor);
    if (!currentEditor) return;
    const settings = workspace.getConfiguration('vueSwiftI18n');
    const defaultLocalesPath = settings.get('defaultLocalesPath');
    const { localesPath, exist } = getLocales({
        fsPath: currentEditor.document.uri.fsPath,
        defaultLocalesPath,
        showError: false,
        showInfo: false,
    });
    if (!exist) {
        mkdir(path.dirname(localesPath), () => {
            tipBeforeWriteJson(currentEditor, localesPath);
        });
    } else {
        tipBeforeWriteJson(currentEditor, localesPath);
    }
};
