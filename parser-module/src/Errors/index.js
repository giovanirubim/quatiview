class CompilationError extends Error {
	constructor(message) {
		super(message);
	}
}

class LexycalError extends CompilationError {
	constructor(index) {
		super('Lexycal error at position ' + index);
		this.index = index;
	}
}

class SyntaticError extends CompilationError {
	constructor(index) {
		super('Syntax error at position' + index);
		this.index = index;
	}
}

module.exports.CompilationError = CompilationError;
module.exports.LexycalError = LexycalError;
module.exports.SyntaticError = SyntaticError;
