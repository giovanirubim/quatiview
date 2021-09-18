import SourceConsumer from './Support/SourceConsumer.js';
import TokenGenerator from './TokenGenerator.js';
import ParsingContext from './ParsingContext.js';
import { CompilationError } from '../errors.js';

// Load non terminals
import './LanguageDefinitions/NonTerminals/';

export const run = (source) => {
    const sourceConsumer = new SourceConsumer(source);
    const tokenGenerator = new TokenGenerator(sourceConsumer);
    const context = new ParsingContext({ tokenGenerator });
    try {
        return context.parse('var-dec');
    } catch(error) {
        if (error instanceof CompilationError) {
            if (error.index === source.index) {
                console.log('Unexpected end of file');
            } else {
                console.log('at ' + error.index);
                console.log(error);
                console.log(`[${source.substr(error.index, 10)}]`);
            }
        } else {
            console.error(error);
        }
    }
};
