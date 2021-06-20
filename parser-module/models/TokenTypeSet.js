import TokenType from './TokenType.js';

export default class TokenTypeSet {

	constructor() {
		// Builds an object that maps for each character what group of tokens can start with that
		// specific character
		const entries = new Array(256).fill().map((_, index) => {
			const char = String.fromCharCode(index);
			return [char, []];
		});
		this.byHeadMap = Object.fromEntries(entries);
	}

	add(...args) {
		const token = new TokenType(...args);
		const { byHeadMap } = this;
		token.headCharset.all().forEach((char) => {
			byHeadMap[char].push(token);
		});
	}
	
	// Returns the group of tokens that can start with the given char
	getByHeadChar(char) {
		return byHeadMap[char];
	}
}
