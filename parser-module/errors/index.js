export class CompilationError extends Error {
	constructor(message) {
		super(message);
	}
}

export class LexycalError extends CompilationError {
	constructor(index) {
		super('Lexycal error at position ' + index);
		this.index = index;
	}
}

export class SyntaticError extends CompilationError {
	constructor(index) {
		super('Syntax error at position' + index);
		this.index = index;
	}
}
