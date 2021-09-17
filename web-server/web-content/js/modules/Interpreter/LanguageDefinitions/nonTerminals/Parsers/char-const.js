import TreeParser from '../../../TreeParser.js';

new TreeParser({
    name: 'char-const',
    parse: ({ tokenGenerator }) => tokenGenerator.pop('char-const'),
});
