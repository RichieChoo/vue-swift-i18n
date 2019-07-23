const vscode = require("vscode");
module.exports = {
  msg: vscode.window.showInformationMessage,
  registerCommand: vscode.commands.registerCommand
};
