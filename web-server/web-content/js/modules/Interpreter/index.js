import SourceConsumer from './Support/SourceConsumer.js';
import TokenGenerator from './TokenGenerator.js';
import TreeParser from './Model/TreeParser.js';
import './LanguageDefinitions/NonTerminals';
import { CompilationError } from '../errors.js';

export const run = (source) => {
    const sourceConsumer = new SourceConsumer(source);
    const tokenGenerator = new TokenGenerator(sourceConsumer);
    try {
        return TreeParser.parse('id', { tokenGenerator });
    } catch(error) {
        if (error instanceof CompilationError) {
            console.log(error, error.index);
        }
    }
};
