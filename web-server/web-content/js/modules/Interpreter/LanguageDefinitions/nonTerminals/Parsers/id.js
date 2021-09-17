import TreeParser from '../../../Model/TreeParser.js';

new TreeParser({
    name: 'id',
    parse: ({ tokenGenerator }) => tokenGenerator.pop('id'),
});
