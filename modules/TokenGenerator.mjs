import SourceConsumer from './SourceConsumer.mjs';
import SyntaticMatch from './SyntaticMatch.mjs';
import Token from './Token.mjs';
import * as Tokens from './Tokens.mjs';
import { LexycalError } from './Errors.mjs'

class TokenGenerator {
	constructor(sourceCode) {
		this.sourceCode = sourceCode;
		this.consumer = new SourceConsumer(sourceCode);
	}
	next() {
		const { consumer } = this;
		const startsAt = consumer.getIndex();
		const tokens = Tokens.getByHeadChar(consumer.nextChar());
		for (let token of tokens) {
			const match = consumer.next(token.pattern);
			if (match !== null) {
				return new SyntaticMatch({
					type: token,
					startsAt: startsAt,
					endsAt: startsAt + match.length,
					content: match,
				});
			}
		}
		throw new LexycalError(consumer.getIndex());
	}
	end() {
		return this.consumer.end();
	}
	all() {
		const res = [];
		while (!this.end()) {
			res.push(this.next());
		}
		return res;
	}
}

const sample = `
for (i=0; i<10; i+=1) {
	j += x;
}
`;
import fs from 'fs';
const src = fs.readFileSync('./SourceConsumer.mjs').toString();
const generator = new TokenGenerator(sample);
console.log(generator.all().map(match => match.content).join(' '));
