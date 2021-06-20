import SourceConsumer from './SourceConsumer.js';
import SyntaticMatch from './SyntaticMatch.js';
import TokenType from './TokenType.js';

import { LexycalError, SyntaticError } from '../errors/index.js';

export default class TokenGenerator {
	constructor(sourceConsumer, tokenSet) {
		this.sourceConsumer = sourceConsumer;
		this.tokenSet = tokenSet;
		this._next = null;
	}
	next(force = false) {
		if (this._next !== null) {
			return this._next;
		}
		const { sourceConsumer } = this;
		if (sourceConsumer.end()) {
			if (force) {
				return new SyntaticError(sourceConsumer.getIndex());
			}
			return null;
		}
		return this._next = this.pop();
	}
	pop() {
		if (this._next !== null) {
			const token = this._next;
			this._next = null;
			return token;
		}
		const { sourceConsumer, tokenSet } = this;
		const startsAt = sourceConsumer.getIndex();
		const nextChar = sourceConsumer.nextChar();
		const tokens = tokenSet.getByHeadChar(nextChar);
		for (let token of tokens) {
			const match = sourceConsumer.next(token.pattern);
			if (match !== null) {
				return new SyntaticMatch({
					type: token,
					startsAt: startsAt,
					endsAt: startsAt + match.length,
					content: match,
				});
				break;
			}
		}
		throw new LexycalError(sourceConsumer.getIndex());		
	}
	all() {
		const res = [];
		while (this.next() !== null) {
			res.push(this.pop());
		}
		return res;
	}
}
