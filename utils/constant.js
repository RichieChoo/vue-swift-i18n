const plugin = {
    name: 'vue-swift-i18n',
    congratulations:
        'Congratulations, your extension "vue-swift-i18n" is now active!',
    noUri: 'please selected a json file first',
};

const DEFAULT_STYLE = {
    color: '#ffffff',
    backgroundColor: '#115A1C',
};
const ERROR_STYLE = {
    color: '#ffffff',
    backgroundColor: 'red',
};
const langArr = ['javascript', 'vue'];

const operation = {
    flatJson: {
        cmd: 'extension.vueSwiftI18n.flatJson',
        title: 'Flat Json',
    },
    showI18n: {
        cmd: 'extension.vueSwiftI18n.showI18n',
        title: 'Show I18n Translate Detail',
    },

    updateI18n: {
        cmd: 'extension.vueSwiftI18n.updateI18n',
        title: 'Update I18n Locales Json',
    },
    swiftI18n: {
        cmd: 'extension.vueSwiftI18n.swiftI18n',
        title: 'Swift I18n',
    },
};
module.exports = {
    DEFAULT_STYLE,
    ERROR_STYLE,
    langArr,
    operation,
    plugin,
};
