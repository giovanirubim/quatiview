export class CompilationError extends Error {
	constructor(message, index) {
		super(message);
		this.index = index;
	}
}
export class LexycalError extends CompilationError {
	constructor(index) {
		super('Lexycal error at ' + index, index);
	}
}
export class SyntaticError extends CompilationError {
	constructor(index, expected) {
		super('Unexpected token', index);
		this.expected = expected;
	}
}
export class RuntimeError extends Error {}
export class MemoryError extends RuntimeError {
	constructor(address, message) {
		super(message);
		this.address = address;
	}
}
export class InvalidAddress extends MemoryError {
	constructor(address) {
		super(address, `Invalid address ${address}`);
	}
}
export class UnallocatedMemoryAccess extends MemoryError {
	constructor(address) {
		super(address, `Unallocated memory access *(${address})`);
	}
}
export class UninitializedMemoryAccess extends MemoryError {
	constructor(address) {
		super(address, `Uninitialized memory access *(${address})`);
	}
}
export class FreeingUnallocatedMemory extends MemoryError {
	constructor(address) {
		super(address, `The address ${address} was not allocated`);
	}
}
export class FreeingANonAllocationAddress extends MemoryError {
	constructor(address) {
		super(address, `The address ${address} is not an address of an allocation block`);
	}
}
export class ExecutionAborted extends Error {}
