import * as Editor from '../Editor/';
import * as Terminal from '../Terminal/';
import Run from './Run/';
import SourceConsumer from './Support/SourceConsumer.js';
import TokenGenerator from './TokenGenerator.js';
import { CompilationError } from '../errors.js';

// Load non terminals
import './LanguageDefinitions/NonTerminals/';
import ParsingContext from './Model/ParsingContext.js';

export default async (source) => {
    const sourceConsumer = new SourceConsumer(source);
    const tokenGenerator = new TokenGenerator(sourceConsumer);
    const context = new ParsingContext({ tokenGenerator });
    const parseTree = context.parse('program');
    const program = context.compile(parseTree);
    return Run(program);
};
