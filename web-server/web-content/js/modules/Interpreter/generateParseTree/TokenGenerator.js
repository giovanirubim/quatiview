import { LexycalError, SyntaticError } from '../../../errors.js';
import ParseTreeNode from './ParseTreeNode.js';

export default class TokenGenerator {
	constructor({ sourceConsumer, tokenSet }) {
		this.sourceConsumer = sourceConsumer;
		this.cache = null;
		this.tokenSet = tokenSet;
	}
	throwSyntaticError(expected = null) {
		throw new SyntaticError(this.sourceConsumer.getIndex(), expected);
	}
	popAny() {
		const { cache, sourceConsumer, tokenSet } = this;
		if (cache !== null) {
			this.cache = null;
			return cache;
		}
		if (sourceConsumer.end()) {
			this.throwSyntaticError();
		}
		const startsAt = sourceConsumer.getIndex();
		const nextChar = sourceConsumer.nextChar();
		const tokens = tokenSet.getByHeadChar(nextChar);
		for (let token of tokens) {
			const match = sourceConsumer.next(token.pattern);
			if (match === null) {
				continue;
			}
			return new ParseTreeNode({
				typeName: token.name,
				startsAt: startsAt,
				endsAt: startsAt + match.length,
				content: match,
			});
		}
		throw new LexycalError(startsAt);
	}
	pop(...typeNames) {
		const expected = typeNames.length === 1 ? typeNames[0] : null;
		const node = this.popAny();
		if (!typeNames.includes(node.typeName)) {
			throw new SyntaticError(node.startsAt, expected);
		}
		return node;
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
	all() {
		const res = [];
		while (this.next() !== null) {
			res.push(this.popAny());
		}
		return res;
	}
}
