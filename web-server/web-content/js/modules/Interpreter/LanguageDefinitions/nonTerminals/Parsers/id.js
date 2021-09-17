import TreeParser from '../../../TreeParser.js';

new TreeParser({
    name: 'id',
    parse: ({ tokenGenerator }) => tokenGenerator.pop('id'),
});
