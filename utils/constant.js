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
        cmd: 'vueSwiftI18n.flatJson',
        title: 'Flat Json',
    },
    showI18n: {
        cmd: 'vueSwiftI18n.showI18n',
        title: 'Show I18n Translate Detail',
    },

    updateI18n: {
        cmd: 'vueSwiftI18n.updateI18n',
        title: 'Update I18n Locales Json',
    },
    swiftI18n: {
        cmd: 'vueSwiftI18n.swiftI18n',
        title: 'Swift I18n',
    },
    hoverI18n:{
        cmd: 'vueSwiftI18n.hoverI18n',
        title: 'Hover I18n',
    },
    openI18nFile:{
        cmd: 'vueSwiftI18n.openI18nFile',
        title: 'Open File',
    }

};
module.exports = {
    DEFAULT_STYLE,
    ERROR_STYLE,
    langArr,
    operation,
    plugin,
};
