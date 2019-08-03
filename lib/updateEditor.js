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
const { openFileByPath } = require('../utils');
var DEFAULT_STYLE = {
    color: '#ffffff',
    backgroundColor: '#115A1C',
};
module.exports = editor => {
    if (!window.activeTextEditor || !window.activeTextEditor.document) {
        return;
    }
    const text = window.activeTextEditor.document.getText();
    const settings = workspace.getConfiguration('vueSwiftI18n');
    const matches = {};
    const styleForRegExp = Object.assign({}, DEFAULT_STYLE, {
        overviewRulerLane: OverviewRulerLane.Right,
    });
    const decorationTypes = {};
    let match;
    while ((match = dollarTRegexp.exec(text))) {
        const startPos = window.activeTextEditor.document.positionAt(
            match.index
        );
        const endPos = window.activeTextEditor.document.positionAt(
            match.index + match[0].length
        );
        const decoration = {
            range: new Range(startPos, endPos),
        };

        const matchedValue = match[0];

        if (matches[matchedValue]) {
            matches[matchedValue].push(decoration);
        } else {
            matches[matchedValue] = [decoration];
        }

        if (!decorationTypes[matchedValue]) {
            decorationTypes[
                matchedValue
            ] = window.createTextEditorDecorationType(styleForRegExp);
        }
    }
    Object.keys(decorationTypes).forEach(v => {
        const decorationType = decorationTypes[v];
        window.activeTextEditor.setDecorations(decorationType, matches[v]);
    });
    msg.info("Show I18n Value Success!")
};
