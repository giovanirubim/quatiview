import SourceConsumer from './SourceConsumer.mjs';
import SyntaticMatch from './SyntaticMatch.mjs';
import Token from './Token.mjs';
import * as Tokens from './Tokens.mjs';
import { LexycalError, SyntaticError } from './Errors.mjs'

class TokenGenerator {
	constructor(sourceConsumer) {
		this.sourceConsumer = sourceConsumer;
		this._next = null;
	}
	next(force = false) {
		if (this._next !== null) {
			return this._next;
		}
		if (this.sourceConsumer.end()) {
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
		const { sourceConsumer } = this;
		const startsAt = sourceConsumer.getIndex();
		const nextChar = sourceConsumer.nextChar();
		const tokens = Tokens.getByHeadChar(nextChar);
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
