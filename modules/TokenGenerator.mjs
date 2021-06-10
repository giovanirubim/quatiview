import SourceConsumer from './SourceConsumer.mjs';
import * as Tokens from './Tokens.mjs';

class TokenGenerator {
	constructor(sourceCode) {
		this.sourceCode = sourceCode;
		this.consumer = new SourceConsumer(sourceCode);
	}
	next() {
		const { consumer } = this;
		if (consumer.index === this.sourceCode.length) {
			return null;
		}
		const tokens = Tokens.getByHeadChar(consumer.nextChar());
		for (let token of tokens) {
		}
	}
}

import fs from 'fs';
const src = fs.readFileSync('./SourceConsumer.mjs').toString();
const generator = new TokenGenerator(src);
