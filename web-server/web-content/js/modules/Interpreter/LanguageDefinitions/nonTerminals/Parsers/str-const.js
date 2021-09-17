import TreeParser from '../../../Model/TreeParser.js';

new TreeParser({
    name: 'str-const',
    parse: ({ tokenGenerator }) => tokenGenerator.pop('str-const'),
});
