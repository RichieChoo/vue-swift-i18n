const {
    msg,
    Position,
    Selection,
    Range,
    workspace,
    window,
    OverviewRulerLane,
} = require('../utils/vs');
const { dollarTRegexp } = require('../utils/regex');
const { openFileByPath, getLocales, getEditor } = require('../utils');
const { DEFAULT_STYLE, ERROR_STYLE, langArr } = require('../utils/constant');
const flatten = require('flat');
const fs = require('fs');

let decorationTypesList = {};
const clearDecorations = () => {
    Object.keys(decorationTypesList).forEach(v => {
        decorationTypesList[v].dispose();
    });
    decorationTypesList = {};
};

const updateDecorations = currentEditor => {
    clearDecorations();
    const text = currentEditor.document.getText();
    const settings = workspace.getConfiguration('vueSwiftI18n');
    const defaultLocalesPath = settings.get('defaultLocalesPath');
    const modulePrefixForGenerateJson = settings.get(
        'modulePrefixForGenerateJson'
    );
    const { localesPath } = getLocales({
        fsPath: currentEditor.document.uri.fsPath,
        defaultLocalesPath,
        showInfo: true,
        showError: true,
    });

    fs.readFile(localesPath, (err, data) => {
        if (!err) {
            const i18nObj = !!modulePrefixForGenerateJson
                ? JSON.parse(data.toString())[modulePrefixForGenerateJson]
                : JSON.parse(data.toString());
            const localeObj = flatten(i18nObj);
            const matches = {};
            const defaultStyleForRegExp = Object.assign({}, DEFAULT_STYLE, {
                overviewRulerLane: OverviewRulerLane.Right,
            });
            const errorStyleForRegExp = Object.assign({}, ERROR_STYLE, {
                overviewRulerLane: OverviewRulerLane.Right,
            });
            // 重置 decorationTypes
            const decorationTypes = {};
            let match;
            while ((match = dollarTRegexp.exec(text))) {
                const matchedValue = match[0];
                const contentText = localeObj[matchedValue];
                const startPos = currentEditor.document.positionAt(match.index);
                const endPos = currentEditor.document.positionAt(
                    match.index + match[0].length
                );
                const styleForRegExp = contentText
                    ? defaultStyleForRegExp
                    : errorStyleForRegExp;
                const decoration = {
                    range: new Range(startPos, endPos),
                    renderOptions: {
                        after: {
                            color: 'rgba(153,153,153,0.8)',
                            contentText: ` ➟ ${contentText}`,
                            fontWeight: 'normal',
                            fontStyle: 'normal',
                        },
                    },
                };

                if (matches[matchedValue]) {
                    matches[matchedValue].push(decoration);
                } else {
                    matches[matchedValue] = [decoration];
                }
                matches[matchedValue] = [decoration];
                if (!decorationTypes[matchedValue]) {
                    decorationTypes[
                        matchedValue
                    ] = window.createTextEditorDecorationType(styleForRegExp);
                }
            }
            Object.keys(decorationTypes).forEach(v => {
                const decorationType = decorationTypes[v];
                decorationTypesList[v] = decorationTypes[v];
                currentEditor.setDecorations(decorationType, matches[v]);
            });
            msg.info('');
        } else {
            msg.error(localesPath + 'is not found');
        }
    });
};

module.exports = ({ editor, context }) => {
    let currentEditor = getEditor(editor);
    if (!currentEditor) return;
    updateDecorations(currentEditor);
    //修改重置编辑器
    workspace.onDidChangeTextDocument(
        event => {
            if (currentEditor && event.document === currentEditor.document) {
                clearDecorations();
            }
        },
        null,
        context.subscriptions
    );
};
