import TreeParser from '../../../Model/TreeParser.js';

new TreeParser({
    name: 'int-const',
    parse: ({ tokenGenerator }) => tokenGenerator.pop('int-const'),
});
