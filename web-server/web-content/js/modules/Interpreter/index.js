import SourceConsumer from './Support/SourceConsumer.js';
import TokenGenerator from './TokenGenerator.js';
import TreeParser from './Model/TreeParser.js';
import './LanguageDefinitions/NonTerminals';
import { CompilationError } from '../errors.js';

export const run = (source) => {
    const sourceConsumer = new SourceConsumer(source);
    const tokenGenerator = new TokenGenerator(sourceConsumer);
    try {
        return TreeParser.parse('str-const', { tokenGenerator });
    } catch(error) {
        if (error instanceof CompilationError) {
            if (error.index === source.index) {
                console.log('Unexpected end of file');
            } else {
                console.log('at ' + error.index);
                console.log(error);
                console.log(source.substr(error.index));
            }
        } else {
            console.error(error);
        }
    }
};

window.run = run;
