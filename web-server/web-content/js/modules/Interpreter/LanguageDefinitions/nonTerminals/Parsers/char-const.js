import TreeParser from '../../../Model/TreeParser.js';

new TreeParser({
    name: 'char-const',
    parse: ({ tokenGenerator }) => tokenGenerator.pop('char-const'),
});
