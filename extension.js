const { registerCommand, msg } = require("./utils/vs");
const { plugin } = require("./lib/constant");
const flat = require("./lib/flat");
function activate(context) {
  //   msg(plugin.congratulations);
  let disposable = registerCommand("extension.vueSwiftI18n.flatJson", uri => {
    if (uri && uri.path) {
      flat(uri)
    } else {
      msg.warn(plugin.noUri);
    }
  });

  context.subscriptions.push(disposable);
}
// exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
  msg.info(`${plugin.name} deactivated`);
}

module.exports = {
  activate,
  deactivate
};
