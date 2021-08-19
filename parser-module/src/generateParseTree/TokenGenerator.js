const { LexycalError, SyntaticError } = require('../Errors');
const TokenSet = require('../PatternDefinitions/Tokens');
const ParseTreeNode = require('../ParseTreeNode');

class TokenGenerator {
	constructor({ sourceConsumer }) {
		this.sourceConsumer = sourceConsumer;
		this.loadedNext = null;
	}
	next() {
		if (this.loadedNext !== null) {
			return this.loadedNext;
		}
		const { sourceConsumer } = this;
		if (sourceConsumer.end()) {
			return null;
		}
		return this.loadedNext = this.pop();
	}
	nextIs(typeName) {
		const next = this.next();
		if (next === null) {
			return false;
		}
		return next.typeName === typeName;
	}
	pop(...typeNames) {
		if (this.loadedNext !== null) {
			const match = this.loadedNext;
			this.loadedNext = null;
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
		const tokens = TokenSet.getByHeadChar(nextChar);
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
