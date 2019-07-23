const { registerCommand, msg } = require("./utils/vs");
const { plugin } = require("./lib/constant");
const fs = require("fs");
function activate(context) {
  //   msg(plugin.congratulations);
  let disposable = registerCommand("extension.vueSwiftI18n.flatJson", uri => {
    if (uri && uri.path) {
		console.warn('current flat file :',uri.path);
	}else{
		msg(plugin.noUri)
	}
  });

  context.subscriptions.push(disposable);
}
// exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
  msg(`${plugin.name} deactivated`);
}

module.exports = {
  activate,
  deactivate
};
