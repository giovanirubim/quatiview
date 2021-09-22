import * as Editor from '../Editor/';
import * as Terminal from '../Terminal/';
import Run from './Run/';
import SourceConsumer from './Support/SourceConsumer.js';
import TokenGenerator from './TokenGenerator.js';
import { CompilationError } from '../errors.js';

// Load non terminals
import './LanguageDefinitions/NonTerminals/';
import ParsingContext from './Model/ParsingContext.js';

export const run = (source) => {
    const sourceConsumer = new SourceConsumer(source);
    const tokenGenerator = new TokenGenerator(sourceConsumer);
    const context = new ParsingContext({ tokenGenerator });
    try {
        const tree = context.parse('program');
        return context.compile(tree);
    } catch(error) {
        if (error instanceof CompilationError) {
            if (error.index === source.index) {
                Terminal.writeln('Unexpected end of file');
            } else {
                Terminal.writeln('at ' + error.index);
                Terminal.writeln(error.toString());
                Terminal.writeln(`${
                    source.substr(error.index, 10)
                }`);
            }
        } else {
            console.error(error);
        }
    }
};

const compile = () => {
    console.clear();
    Terminal.clear();
    const start = run(Editor.getText());
    if (start) {
        Terminal.writeln('Success');
        Run(start);
    }
};

$(document).ready(() => {
    Editor.load();
    Terminal.init();
    $('#editor-section textarea').on('input', compile);
    compile();
});
