import SyntaticMatch from './SyntaticMatch.js';
import { LexycalError, SyntaticError } from '../errors/index.js';

export default class TokenGenerator {
	constructor(sourceConsumer, tokenTypeSet) {
		this.sourceConsumer = sourceConsumer;
		this.tokenTypeSet = tokenTypeSet;
		this.loadedNext = null;
	}
	next(force = false) {
		if (this.loadedNext !== null) {
			return this.loadedNext;
		}
		const { sourceConsumer } = this;
		if (sourceConsumer.end()) {
			if (force) {
				throw new SyntaticError(sourceConsumer.getIndex());
			}
			return null;
		}
		return this.loadedNext = this.pop();
	}
	pop() {
		if (this.loadedNext !== null) {
			const token = this.loadedNext;
			this.loadedNext = null;
			return token;
		}
		const { sourceConsumer, tokenTypeSet } = this;
		const startsAt = sourceConsumer.getIndex();
		const nextChar = sourceConsumer.nextChar();
		const tokens = tokenTypeSet.getByHeadChar(nextChar);
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
