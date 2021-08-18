const SyntaticElement = require('./SyntaticElement');

class NonTerminal extends SyntaticElement {
	constructor(name) {
		super(name);
	}
}

module.exports.NonTerminal = NonTerminal;
