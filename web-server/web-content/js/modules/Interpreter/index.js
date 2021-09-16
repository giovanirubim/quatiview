import SourceConsumer from './Support/SourceConsumer.js';
import TokenGenerator from './TokenGenerator.js';
import TreeParser from './Model/NonTerminal.js';
import './LanguageDefinitions/NonTerminals';

export const run = (source) => {
    const sourceConsumer = new SourceConsumer(source);
    const tokenGenerator = new TokenGenerator(sourceConsumer);
    TreeParser.parse('id', { tokenGenerator });
};
