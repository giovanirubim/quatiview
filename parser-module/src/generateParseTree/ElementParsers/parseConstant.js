const SyntaticMatch = require('../ParseTreeNode');
const { CONSTANT } = require('../../PatternDefinitions/NonTerminals');

module.exports = (tokenGenerator) => new ParseTreeNode({
	type: CONSTANT,
	children: [
		tokenGenerator.pop('NULL', 'integer-constant'),
	],
});
