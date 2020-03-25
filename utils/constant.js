const constants = {
	defaultStyle: { color: "#ffffff", backgroundColor: "#115A1C" },
	errorStyle: { color: "#ffffff", backgroundColor: "red" },
	langArr: ["javascript", "vue"],
	operation: {
		flatJson: { cmd: "vueSwiftI18n.flatJson", title: "Flat Json" },
		unFlatJson: { cmd: "vueSwiftI18n.unFlatJson", title: "unFlat Json" },
		showI18n: {
			cmd: "vueSwiftI18n.showI18n",
			title: "Show I18n Translate Detail"
		},
		updateI18n: {
			cmd: "vueSwiftI18n.updateI18n",
			title: "Update I18n Locales Json"
		},
		swiftI18n: { cmd: "vueSwiftI18n.swiftI18n", title: "Swift I18n" },
		hoverI18n: { cmd: "vueSwiftI18n.hoverI18n", title: "Hover I18n" },
		openI18nFile: { cmd: "vueSwiftI18n.openI18nFile", title: "Open File" }
	},
	plugin: {
		name: "vue-swift-i18n",
		congratulations:
			'Congratulations, your extension "vue-swift-i18n" is now active!',
		noUri: "please selected a json file first"
	},
	pkgFileName: "package.json",
	customConfigFileName: "richierc.json",
	customConfig: {},
	updateCustomConfig(newConfig = {}) {
		this.customConfig = Object.assign(this.customConfig, newConfig);
	}
};
module.exports = constants;
