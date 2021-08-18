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
	constructor(index, expected = null) {
		super('Syntax error at position' + index);
		this.index = index;
		this.expected = expected;
	}
}

module.exports.CompilationError = CompilationError;
module.exports.LexycalError = LexycalError;
module.exports.SyntaticError = SyntaticError;
