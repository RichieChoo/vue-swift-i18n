const vscode = require("vscode");
module.exports = {
  msg: {
    info: vscode.window.showInformationMessage,
    warn: vscode.window.showWarningMessage,
    error: vscode.window.showErrorMessage
  },
  registerCommand: vscode.commands.registerCommand,
};
