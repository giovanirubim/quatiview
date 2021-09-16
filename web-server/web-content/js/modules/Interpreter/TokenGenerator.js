import * as Tokens from './LanguageDefinitions/Tokens';

export default class TokenGenerator {
	constructor({ sourceConsumer }) {
		this.sourceConsumer = sourceConsumer;
		this.cache = null;
		this.target = null;
	}
	throwSyntaticError(expected = null) {
		throw new SyntaticError(this.sourceConsumer.getIndex(), expected);
	}
	popAny() {
		const { cache, sourceConsumer } = this;
		if (cache !== null) {
			this.cache = null;
			return cache;
		}
		if (sourceConsumer.end()) {
			this.throwSyntaticError();
		}
		const startsAt = sourceConsumer.getIndex();
		const nextChar = sourceConsumer.nextChar();
		const tokens = Tokens.getByHeadChar(nextChar);
		for (let token of tokens) {
			const match = sourceConsumer.next(token.pattern);
			if (match === null) {
				continue;
			}
			const node = new ParseTreeNode({
				typeName: token.name,
				startsAt: startsAt,
				endsAt: startsAt + match.length,
				content: match,
			});
			this.target?.push?.(node);
			return node;
		}
		throw new LexycalError(startsAt);
	}
	pop(...typeNames) {
		const expected = typeNames.length === 1 ? typeNames[0] : null;
		if (!this.cache && this.sourceConsumer.end()) {
			this.throwSyntaticError(expected);
		}
		const node = this.popAny();
		if (!typeNames.includes(node.typeName)) {
			throw new SyntaticError(node.startsAt, expected);
		}
		return node;
	}
	popMany(typeName) {
		const result = [];
		while (this.next()?.typeName === typeName) {
			result.push(this.popAny());
		}
		return result;
	}
	next() {
		const { cache, sourceConsumer } = this;
		if (cache !== null) {
			return cache;
		}
		if (sourceConsumer.end()) {
			return null;
		}
		return this.cache = this.popAny();
	}
	nextIs(...typeNames) {
		const next = this.next();
		if (next === null) {
			return false;
		}
		return typeNames.includes(next.typeName);
	}
	popIfIs(...typeNames) {
		if (this.nextIs(...typeNames)) {
			return this.popAny();
		}
		return null;
	}
	getState() {
		const consumerState = this.sourceConsumer.getState();
		const { cache } = this;
		return { consumerState, cache };
	}
	setState({ consumerState, cache }) {
		this.sourceConsumer.setState(consumerState);
		this.cache = cache;
		return this;
	}
}
