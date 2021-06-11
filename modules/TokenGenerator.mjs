import SourceConsumer from './SourceConsumer.mjs';
import SyntaticMatch from './SyntaticMatch.mjs';
import Token from './Token.mjs';
import * as Tokens from './Tokens.mjs';
import { LexycalError } from './Errors.mjs'

export default function* (sourceCode) {
	const consumer = new SourceConsumer(sourceCode);
	while (!consumer.end()) {
		const startsAt = consumer.getIndex();
		const nextChar = consumer.nextChar();
		const tokens = Tokens.getByHeadChar(nextChar);
		let result = null;
		for (let token of tokens) {
			const match = consumer.next(token.pattern);
			if (match !== null) {
				result = new SyntaticMatch({
					type: token,
					startsAt: startsAt,
					endsAt: startsAt + match.length,
					content: match,
				});
				break;
			}
		}
		if (result) {
			yield result;
		} else {
			throw new LexycalError(consumer.getIndex());		
		}
	}
};
