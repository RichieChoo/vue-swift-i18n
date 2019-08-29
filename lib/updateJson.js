const {
  openFileByPath,
  getPrefix,
  getRange,
  getLocales,
  getValueFormPrefix,
  getEditor,
  showMessage
} = require("../utils");
const { langArr, operation } = require("../utils/constant");
const flatten = require("flat");
const unflatten = require("unflatten");
const fs = require("fs");
const path = require("path");
const mkdir = require("mkdirp");
const Puid = require("puid");
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
  warnRegexp
} = require("../utils/regex");

const {
  msg,
  Position,
  Selection,
  Range,
  workspace,
  window,
  OverviewRulerLane
} = require("../utils/vs");

const getLineCnWord = ({ lineText, reg, resoloveReg, initWordArr = [] }) => {
  let word = lineText.match(reg) || initWordArr;
  if (Array.isArray(word) && word.length > 0) {
    word = word
      .map(v => {
        //过滤特殊字符的匹配
        if (v.match(warnRegexp)) {
          return false;
        } else {
          return reg === propertyRegexp
            ? v.split("=")[1].replace(resoloveReg, "")
            : v.replace(resoloveReg, "");
        }
      })
      .filter(v => !!v)
      .concat(initWordArr);
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
  const settings = workspace.getConfiguration("vueSwiftI18n");
  const doNotDisturb = settings.get("doNotDisturb");
  const notAlertBeforeUpdateI18n = settings.get("notAlertBeforeUpdateI18n");
  if (doNotDisturb || notAlertBeforeUpdateI18n) {
    writeJson(currentEditor, localesPath);
  } else {
    msg
      .info(
        `${
          operation.updateI18n.title
        } will cover the key which has same value in: \n${localesPath}`,
        { modal: true },
        "OK", //此处的顺序位置 对应 enter的响应
        "View it"
      )
      .then(result => {
        if (result === "View it") {
          openFileByPath(localesPath, {
            selection: new Range(new Position(0, 0), new Position(0, 0)),
            preview: false,
            viewColumn: currentEditor.viewColumn + 1
          });
        }
        if (result === "OK") {
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
    const isTemplate = range.template.end && i < range.template.end;
    const isScript = !range.template.end || i > range.template.end;
    if (
      (!range.template.begin &&
        range.template.begin !== 0 &&
        range.template.end) ||
      (range.template.begin && !range.template.end && range.template.end !== 0)
    ) {
      msg.error("当前vue文件template标签不完整");
      return;
    }
    if (
      (!range.script.begin && range.script.begin !== 0 && range.script.end) ||
      (range.script.begin && !range.script.end && range.script.end !== 0)
    ) {
      msg.error("当前vue文件script标签不完整");
      return;
    }
    //过滤单行注释，多行注释不考虑
    if (!lineText.match(commentRegexp)) {
      //匹配 template ><下的汉字
      if (lineText.match(templateTextInAngleBracketsRegexp)) {
        cnWordArr = getLineCnWord({
          lineText,
          reg: templateTextInAngleBracketsRegexp,
          resoloveReg: spaceRegexp
        });
      }

      //配合template range 判断 是否是template中的, warnRegexp判断是一整行 空字符开头结尾的 汉字
      if (
        lineText.match(templateTextInLineRegexp) &&
        !lineText.match(warnRegexp) &&
        isTemplate
      ) {
        cnWordArr = getLineCnWord({
          lineText,
          reg: templateTextInLineRegexp,
          resoloveReg: firstSpaceRegexp,
          initWordArr: cnWordArr
        });
      }

      //匹配属性中的汉字
      if (lineText.match(propertyRegexp)) {
        cnWordArr = getLineCnWord({
          lineText,
          reg: propertyRegexp,
          resoloveReg: quotationRegexp,
          initWordArr: cnWordArr
        });
      }

      //匹配script中的汉字
      if (lineText.match(scriptRegexp)) {
        cnWordArr = getLineCnWord({
          lineText,
          reg: scriptRegexp,
          resoloveReg: quotationRegexp,
          initWordArr: cnWordArr
        });
      }
    }
    if (cnWordArr.length > 0) {
      lines.push(...cnWordArr);
    }
  }
  const linesObj = getlinesObj(Array.from(new Set(lines)));
  fs.readFile(localesPath, (err, data) => {
    let _data;
    if (err) {
      _data = {};
    } else {
      _data = !data.toString() ? {} : JSON.parse(data.toString());
    }
    let temp = getValueFormPrefix(_data, prefix);
    if (Object.keys(linesObj).length !== 0) {
      //已存在 => 智能替换（1.相同val时，新的key,val替换原来的key,val。2.不同val时，保存新增key,val和原有的key,val,）
      Object.keys(linesObj).forEach(v => {
        if (!temp || Object.keys(temp).length === 0) {
          _data[prefix] = linesObj;
        } else {
          Object.keys(temp).forEach(p => {
            if (temp[p] === linesObj[v]) {
              delete temp[p];
              temp[v] = linesObj[v];
            } else {
              temp[v] = linesObj[v];
            }
          });
          _data[prefix] = temp;
        }
      });
    } else {
      showMessage({
        message: "There are no Chinese match in :",
        file: localesPath,
        needOpen: false
      });
      return;
    }
    let str = JSON.stringify(unflatten(_data), null, 4);
    fs.writeFile(localesPath, str, err => {
      if (!err) {
        showMessage({
          message: `${operation.updateI18n.title} Success : ${localesPath}`,
          file: localesPath,
          editor: currentEditor
        });
      }
    });
  });
};

module.exports = ({ editor, context }) => {
  let currentEditor = getEditor(editor);
  if (!currentEditor) return;
  const settings = workspace.getConfiguration("vueSwiftI18n");
  const defaultLocalesPath = settings.get("defaultLocalesPath");
  const { localesPath, exist } = getLocales({
    fsPath: currentEditor.document.uri.fsPath,
    defaultLocalesPath,
    showError: false,
    showInfo: false
  });
  if (!exist) {
    mkdir(path.dirname(localesPath), () => {
      tipBeforeWriteJson(currentEditor, localesPath);
    });
  } else {
    tipBeforeWriteJson(currentEditor, localesPath);
  }
};
