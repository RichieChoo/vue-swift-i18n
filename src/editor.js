const { msg, Position, Selection, Range, workspace } = require('../utils/vs');
var fs = require('fs');
var path = require('path');
const flatten = require('flat');
//匹配属性或者js中的汉字
// 后行否定断言  和  正向否定查找 匹配 template下的汉字
const templateBeginRegexp = /\<template\>/g;
const templateEndRegexp = /\<\/template\>/g;
const scriptBeginRegexp = /\<script\>/g;
const scripteEndRegexp = /\<\/script\>/g;
const scriptRegexp = /(?<!=)["|'][\u4e00-\u9fa5]+["|']/g;
const propertyRegexp = /\s\w+=["|'][\u4e00-\u9fa5]+["|']/g;
const templateTextRegexp = /(?<!["|'])[\u4e00-\u9fa5]+(?!["|'])/g;

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
        let lineText = line.text || '';
        console.warn('lineText', typeof lineText);
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

        //{{$t("xx")}}   template下 html替换
        if (templateTextRegexp.test(lineText)) {
            lineText = lineText.replace(templateTextRegexp, str => {
                const result = localeObj[str];
                if (result) {
                    return "{{$t('" + result + "')}}";
                }
                return str;
            });
            console.warn('lineText', lineText);
        }

        //$t("xx")   template下 属性替换
        if (propertyRegexp.test(lineText)) {
            lineText = lineText.replace(propertyRegexp, str => {
                console.warn('str', str);
                const prefix = str.split('=')[0].replace(/\s/g, ' :');

                const mainStr = str.split('=')[1].replace(/[\"|\']/g, '');
                const result = localeObj[mainStr];
                if (result) {
                    return `${prefix}="$t('${result}')"`;
                }
                return str;
            });
        }
        //this.$t("xx")   script下 替换
        if (scriptRegexp.test(lineText)) {
            if (!range.template.end || i > range.template.end) {
                lineText = lineText.replace(scriptRegexp, str => {
                    const resultStr = str.replace(/[\"|\']/g, '');
                    const result = localeObj[resultStr];
                    if (result) {
                        return "this.$t('" + result + "')";
                    }
                    return str;
                });
            }
            console.warn('lineText', lineText);
        }
        lines.push(lineText);
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
