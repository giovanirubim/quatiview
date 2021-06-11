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
		const nextChar = consumer.nextChar();
		const tokens = Tokens.getByHeadChar(nextChar);
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
for (int i=0; i<10; i+=1) {
	j = j + x;
}
char str[10];
y = y - 15 - x*10 + (z%w - k/p);
a(object->attr + 4.5 + var.n);
chr = 'k';
chr = '\\n';
print("this is a string", '\\0');
array[x] = 95;
if (x >= 10 || y == z || n <= p && a != 1) {
	return;
}
`;
import fs from 'fs';
const src = fs.readFileSync('./SourceConsumer.mjs').toString();
const generator = new TokenGenerator(sample);
console.log(generator.all().map((match) => {
	return `${match.type.name}: [${match.content}]`;
}).join('\n'));
