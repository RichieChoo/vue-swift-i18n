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
} = require('./vs');
const {
    templateBeginRegexp,
    templateEndRegexp,
    scriptBeginRegexp,
    scripteEndRegexp,
} = require('./regex');
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

const varifyFile = filePath => {
    if (!fs.existsSync(filePath)) {
        //TODO: 跳转到国际化设置路径!
        msg.error(`Not Found File:${filePath}`);
        return false;
    } else {
        //TODO: 跳转查看该文件!
        msg.info(`Get Locales Path:${filePath}`);
        return filePath;
    }
};

const getLocales = (fsPath, defaultLocalesPath) => {
    const dirName = path.dirname(fsPath);
    if (fs.existsSync(path.join(dirName, 'package.json'))) {
        let jsonPath = path.join(dirName, 'src', 'locales', 'zh-cn.json');
        if (!!defaultLocalesPath) {
            //TODO: 兼容绝对路径!
            jsonPath = path.join(dirName, defaultLocalesPath, 'zh-cn.json');
        }
        return varifyFile(jsonPath);
    } else {
        return getLocales(dirName, defaultLocalesPath);
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
};
