const path = require('path');
const fs = require('fs');
const {
    registerCommand,
    msg,
    open,
    file,
    Range,
    Position,
    ViewColumn,
    window,
} = require('./vs');
const {
    templateBeginRegexp,
    templateEndRegexp,
    scriptBeginRegexp,
    scripteEndRegexp,
} = require('./regex');
const { langArr } = require('./constant');
const defaultOption = {
    selection: new Range(new Position(0, 0), new Position(0, 0)),
    preview: false,
};
const openFileByPath = (fPath, option) => {
    return open(file(fPath), option || defaultOption);
};

const getCellRange = ({ editor, regex, line, lineEnd }) =>
    editor.document.getWordRangeAtPosition(new Position(line, lineEnd), regex);

const getRange = editor => {
    const range = {
        template: {},
        script: {},
    };
    const lineCount = editor.document.lineCount;
    for (let i = 0; i < lineCount; i++) {
        const line = editor.document.lineAt(i);
        const tBegin = getCellRange({
            editor,
            regex: templateBeginRegexp,
            line: i,
            lineEnd: line.range.end.character,
        });
        const tEnd = getCellRange({
            editor,
            regex: templateEndRegexp,
            line: i,
            lineEnd: line.range.end.character,
        });
        const sBegin = getCellRange({
            editor,
            regex: scriptBeginRegexp,
            line: i,
            lineEnd: line.range.end.character,
        });
        const sEnd = getCellRange({
            editor,
            regex: scripteEndRegexp,
            line: i,
            lineEnd: line.range.end.character,
        });
        if (tBegin) {
            range.template.begin = tBegin.start.line;
        } else if (tEnd) {
            range.template.end = tEnd.start.line;
        }
        if (sBegin) {
            range.script.begin = sBegin.start.line;
        } else if (sEnd) {
            range.script.end = sEnd.start.line;
        }
    }
    return range;
};
const getEditor = editor => {
    let currentEditor = editor || window.activeTextEditor;
    if (
        !currentEditor &&
        !langArr.includes(currentEditor.document.languageId)
    ) {
        return false;
    }

    return currentEditor;
};
const showMessageAndOpen = ({ type = 'info', message, file, editor }) => {
    const showMessage = type === 'error' ? msg.error : msg.info;
    const viewColumn = editor
        ? editor.viewColumn + 1
        : getEditor(editor)
        ? getEditor(editor).viewColumn+1
        : 1;
    showMessage(message, 'Got it', 'Open it').then(val => {
        if (val === 'Open it') {
            openFileByPath(file, {
                selection: new Range(new Position(0, 0), new Position(0, 0)),
                preview: false,
                viewColumn,
            });
        }
    });
};
const varifyFile = ({ fsPath, showError, showInfo }) => {
    let exist = false;
    if (!fs.existsSync(fsPath)) {
        //TODO: 跳转到国际化设置路径!
        showError && msg.error(`Not Found File:${fsPath}`);
    } else {
        showInfo &&
            showMessageAndOpen({
                message: `Get Locales Path:${fsPath}`,
                file: fsPath,
            });
        exist = true;
    }
    return { localesPath: fsPath, exist };
};

const getLocales = ({
    fsPath,
    defaultLocalesPath,
    showInfo = false,
    showError = true,
}) => {
    const dirName = path.dirname(fsPath);
    if (fs.existsSync(path.join(dirName, 'package.json'))) {
        let jsonPath = path.join(dirName, 'src', 'locales', 'zh-cn.json');
        if (!!defaultLocalesPath) {
            jsonPath = path.join(dirName, defaultLocalesPath, 'zh-cn.json');
        }
        return varifyFile({ fsPath: jsonPath, showInfo, showError });
    } else {
        return getLocales({
            fsPath: dirName,
            defaultLocalesPath,
            showInfo,
            showError,
        });
    }
};
const changeObjeValueKey = obj => {
    const result = {};
    Object.keys(obj).forEach(v => {
        if (!result[obj[v]]) {
            result[obj[v]] = v;
        }
    });
    return result;
};

module.exports = {
    openFileByPath,
    getCellRange,
    getRange,
    getLocales,
    changeObjeValueKey,
    getEditor,
    showMessageAndOpen,
};
