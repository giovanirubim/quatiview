import * as Tokens from './LanguageDefinitions/Tokens';
import { LexycalError, SyntaticError } from '../errors.js';
import ParseTreeNode from './Model/ParseTreeNode.js';

export default class TokenParser {
	constructor(sourceConsumer) {
		this.sourceConsumer = sourceConsumer;
		this.cache = null;
		const index = sourceConsumer.getIndex();
		this.nextIndex = index;
		this.lastIndex = index;
	}
	throwSyntaticError(expected = null) {
		throw new SyntaticError(this.sourceConsumer.getIndex(), expected);
	}
	popCache() {
		const { cache } = this;
		this.cache = null;
		this.lastIndex = cache.endsAt;
		this.nextIndex = this.sourceConsumer.getIndex();
		return cache;
	}
	loadCache() {
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
			this.cache = new ParseTreeNode({
				name: token.name,
				startsAt: startsAt,
				endsAt: startsAt + match.length,
				content: match,
			});
			return this;
		}
		throw new LexycalError(startsAt);
	}
	popAny() {
		if (!this.cache) this.loadCache();
		return this.popCache();
	}
	pop(...names) {
		const expected = names.length === 1 ? names[0] : null;
		if (!this.cache && this.sourceConsumer.end()) {
			this.throwSyntaticError(expected);
		}
		const node = this.popAny();
		if (!names.includes(node.name)) {
			throw new SyntaticError(node.startsAt, expected);
		}
		return node;
	}
	popMany(name) {
		const result = [];
		while (this.next()?.name === name) {
			result.push(this.popCache());
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
		this.loadCache();
		return this.cache;
	}
	nextIs(...names) {
		const next = this.next();
		if (next === null) {
			return false;
		}
		return names.includes(next.name);
	}
	popIfIs(...names) {
		if (this.nextIs(...names)) {
			return this.popCache();
		}
		return null;
	}
	getState() {
		const consumerState = this.sourceConsumer.getState();
		const { cache, lastIndex, nextIndex } = this;
		return { consumerState, cache, lastIndex, nextIndex };
	}
	setState({ consumerState, cache, lastIndex, nextIndex }) {
		this.sourceConsumer.setState(consumerState);
		this.cache = cache;
		this.lastIndex = lastIndex;
		this.nextIndex = nextIndex;
		return this;
	}
}
