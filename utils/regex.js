//约定:所有汉字匹配均以汉字开头,所有正则针对 单行匹配
const spaceRegexp = /\s/g;
const firstSpaceRegexp = /\s+/;
const quotationRegexp = /[\"|\']/g;
const angleBracketsRegexp = /[\<|\>]/g;

const templateBeginRegexp = /\<template\>/g;
const templateEndRegexp = /\<\/template\>/g;
const scriptBeginRegexp = /\<script\>/g;
const scripteEndRegexp = /\<\/script\>/g;

//匹配注释
const commentRegexp = /(\s+(<!--)(.*)(\n)*(-->)$)|(\s+\/\/.*)/g;

//匹配js中的汉字,配合template range 判断 是否是template中的js汉字  √
const scriptRegexp = /(?<!=)["|'][\u4e00-\u9fa5]\S+["|']/g;

//匹配属性中的汉字 √
const propertyRegexp = /(\s\w+=["|'][\u4e00-\u9fa5]\S+["|'])|(\s\w+=["|'][\u4e00-\u9fa5]["|'])/g;

// 单行  匹配 template下的汉字
const templateTextRegexp = /(\>[\u4e00-\u9fa5]\S+\<)|((?<=\s)\s+[\u4e00-\u9fa5]\S+)/g;

// 单行  匹配 template ><下的汉字
const templateTextInAngleBracketsRegexp = /\>[\u4e00-\u9fa5]\S+\</g;

// 单行  匹配 template 空字符开头的 汉字
const templateTextInLineRegexp = /(?<=\s)\s+[\u4e00-\u9fa5]\S+/g;

// 匹配多行 $t替换的字符串
const dollarTRegexp = /(?<=\$t\(["'])[^'"]+/gm;
module.exports = {
    templateBeginRegexp,
    templateEndRegexp,
    scriptBeginRegexp,
    scripteEndRegexp,

    scriptRegexp,
    propertyRegexp,
    templateTextRegexp,
    templateTextInLineRegexp,
    templateTextInAngleBracketsRegexp,
    angleBracketsRegexp,
    quotationRegexp,
    spaceRegexp,
    firstSpaceRegexp,
    commentRegexp,

    dollarTRegexp
};
