import Net from '../Net.js';
import Run from './Run/';
import SourceConsumer from './Support/SourceConsumer.js';
import TokenParser from './TokenParser.js';

// Load non terminals
import './LanguageDefinitions/NonTerminals/';
import Context from './Model/Context.js';

export const run = async (source) => {
    const sourceConsumer = new SourceConsumer(source);
    const tokenParser = new TokenParser(sourceConsumer);
    const context = new Context({ tokenParser });
    const parseTree = context.parse('program');
    const program = context.compile(parseTree);
    Net.memory.clear();
    return Run(program);
};
