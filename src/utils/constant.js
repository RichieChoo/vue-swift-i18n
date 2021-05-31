const constants = {
	defaultStyle: {
		fontStyle: "italic",
		// textDecoration: "underline solid green"
	},
	errorStyle: {
		fontStyle: "italic",
		// textDecoration: "underline solid red"
	},
	langArr: ["javascript", "vue"],
	operation: {
		flatJson: { cmd: "vueSwiftI18n.flatJson", title: "Flat Json" },
		unFlatJson: { cmd: "vueSwiftI18n.unFlatJson", title: "unFlat Json" },
		showI18n: {
			cmd: "vueSwiftI18n.showI18n",
			title: "Show I18n Translate Detail",
		},
		updateI18n: {
			cmd: "vueSwiftI18n.updateI18n",
			title: "Update I18n Locales Json",
		},
		generateRichieRC: {
			cmd: "vueSwiftI18n.generateRichieRC",
			title: "Generate scope config file",
		},
		swiftI18n: { cmd: "vueSwiftI18n.swiftI18n", title: "Swift I18n" },
		hoverI18n: { cmd: "vueSwiftI18n.hoverI18n", title: "Hover I18n" },
		openI18nFile: { cmd: "vueSwiftI18n.openI18nFile", title: "Open File" },
	},
	plugin: {
		name: "vue-swift-i18n",
		congratulations:
			'Congratulations, your extension "vue-swift-i18n" is now active!',
		noUri: "please selected a json file first",
	},
	defaultConfig: {
		defaultLocalesPath: "src/locales",
		puidType: "short",
		i18nValueHover: true,
		langFile: "zh-cn.json",
		modulePrefixFoUpdateJson: "",
		notAlertBeforeUpdateI18n: false,
		fileNameSubstitute: "components",
		notUseFileNameAsKey: false,
		parentDirLevel: 1,
	},

	pkgFileName: "package.json",
	customConfigFileName: "richierc.json",
};
module.exports = constants;
