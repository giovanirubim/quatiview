import TreeParser from '../../../Model/TreeParser.js';

new TreeParser({
    name: 'id',
    parse: (ctx) => ctx.tokenGenerator.pop('id'),
});
