const { Hover } = require("../utils/vs");

/**
 * 鼠标悬停提示，当鼠标停在xxx.vue/xxx.js时，
 * 自动显示对应国际化的key，value
 * @param document The document in which the commandT was invoked.
 * @param position The position at which the command was invoked.
 * @param token A cancellation token.
 * @return A hover or a thenable that resolves to such. The lack of a result can be
 * signaled by returning `undefined` or `null`.
 */
const provideHover = (document, position, token) => {
  const fileName = document.fileName;
  const select = document.selection;
  const word = document.getText(document.getWordRangeAtPosition(position));

  console.log("hover已生效");
  // hover内容支持markdown语法
  return new Hover(`* **名称**：1\n* **版本**：2\n* **许可协议**：3`);
};

module.exports = {
  provideHover
};
