import Net from '../Net.js';
import Run from './Run/';
import SourceConsumer from './Support/SourceConsumer.js';
import TokenGenerator from './TokenGenerator.js';

// Load non terminals
import './LanguageDefinitions/NonTerminals/';
import ParsingContext from './Model/ParsingContext.js';

export const run = async (source) => {
    const sourceConsumer = new SourceConsumer(source);
    const tokenGenerator = new TokenGenerator(sourceConsumer);
    const context = new ParsingContext({ tokenGenerator });
    const parseTree = context.parse('program');
    const program = context.compile(parseTree);
    Net.memory.clear();
    return Run(program);
};
