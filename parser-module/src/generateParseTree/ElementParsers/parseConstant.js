const SyntaticMatch = require('../models/SyntaticMatch');
const { CONSTANT } = require('../../PatternDefinitions/NonTerminals');

module.exports = (tokenGenerator) => new SyntaticMatch({
	type: CONSTANT,
	children: [
		tokenGenerator.pop('NULL', 'integer-constant'),
	],
});
