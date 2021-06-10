export class LexycalError extends Error {
	constructor(index) {
		super('Lexycal error at position ' + index);
		this.index = index;
	}
}
