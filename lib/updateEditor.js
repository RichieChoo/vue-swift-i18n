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
const { openFileByPath, getLocales } = require('../utils');
const {
    DEFAULT_STYLE,
    ERROR_STYLE,
    DEFAULT_STYLE_WITHOUT_BACKGROUND,
    langArr,
} = require('../utils/constant');
const flatten = require('flat');
const fs = require('fs');

let decorationTypesList = {};
const clearDecorations = () => {
    Object.keys(decorationTypesList).forEach(v => {
        decorationTypesList[v].dispose();
    });
    decorationTypesList = {};
};

const updateDecorations = () => {
    clearDecorations();
    if (
        !window.activeTextEditor ||
        !window.activeTextEditor.document ||
        !langArr.includes(window.activeTextEditor.document.languageId)
    ) {
        return;
    }
    const text = window.activeTextEditor.document.getText();
    const settings = workspace.getConfiguration('vueSwiftI18n');
    const defaultLocalesPath = settings.get('defaultLocalesPath');
    const localesPath = getLocales(
        window.activeTextEditor.document.uri.fsPath,
        defaultLocalesPath
    );

    fs.readFile(localesPath, (err, data) => {
        if (!err) {
            const localeObj = flatten(JSON.parse(data.toString()));
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
                const startPos = window.activeTextEditor.document.positionAt(
                    match.index
                );
                const endPos = window.activeTextEditor.document.positionAt(
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
                window.activeTextEditor.setDecorations(
                    decorationType,
                    matches[v]
                );
            });
        } else {
            msg.error(localesPath + 'is not found');
        }
    });
};

module.exports = context => {
    updateDecorations();
    //修改重置编辑器
    workspace.onDidChangeTextDocument(
        event => {
            if (
                window.activeTextEditor &&
                event.document === window.activeTextEditor.document
            ) {
                clearDecorations();
            }
        },
        null,
        context.subscriptions
    );
};
