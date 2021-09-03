const { LexycalError, SyntaticError } = require('../Errors');
const ParseTreeNode = require('../ParseTreeNode');

class TokenGenerator {
	constructor({ sourceConsumer, tokenSet }) {
		this.sourceConsumer = sourceConsumer;
		this.cache = null;
		this.tokenSet = tokenSet;
	}
	next() {
		if (this.cache !== null) {
			return this.cache;
		}
		const { sourceConsumer } = this;
		if (sourceConsumer.end()) {
			return null;
		}
		return this.cache = this.pop();
	}
	nextIs(...typeNames) {
		const next = this.next();
		if (next === null) {
			return false;
		}
		return typeNames.include(next.typeName);
	}
	pop(...typeNames) {
		if (this.cache !== null) {
			const match = this.cache;
			this.cache = null;
			if (!typeNames.includes(match.typeName)) {
				let expected;
				if (typeNames.length === 1) {
					expected = typeNames[0];
				}
				throw new SyntaticError(match.startsAt, expected);
			}
			return match;
		}
		const { sourceConsumer } = this;
		const startsAt = sourceConsumer.getIndex();
		const nextChar = sourceConsumer.nextChar();
		const tokens = this.tokenSet.getByHeadChar(nextChar);
		for (let token of tokens) {
			const match = sourceConsumer.next(token.pattern);
			if (match !== null) {
				return new ParseTreeNode({
					typeName: token.name,
					startsAt: startsAt,
					endsAt: startsAt + match.length,
					content: match,
				});
				break;
			}
		}
		throw new LexycalError(sourceConsumer.getIndex());
	}
	throwSyntaticError() {
		const { sourceConsumer } = this;
		throw new SyntaticError(sourceConsumer.getIndex());
	}
	popIfIs(...typeNames) {
		const next = this.next();
		if (next === null) {
			return null;
		}
		if (!typeNames.includes(next.typeName)) {
			return null;
		}
		return this.pop();
	}
	all() {
		const res = [];
		while (this.next() !== null) {
			res.push(this.pop());
		}
		return res;
	}
}

module.exports = TokenGenerator;
