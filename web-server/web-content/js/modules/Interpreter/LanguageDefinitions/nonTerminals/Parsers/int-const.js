import TreeParser from '../../../TreeParser.js';

new TreeParser({
    name: 'int-const',
    parse: ({ tokenGenerator }) => tokenGenerator.pop('int-const'),
});
