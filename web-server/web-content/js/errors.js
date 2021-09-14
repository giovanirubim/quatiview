export class CompilationError extends Error {}
export class LexycalError extends CompilationError {
	constructor(index) {
		super('Lexycal error at ' + index);
		this.index = index;
	}
}
export class SyntaticError extends CompilationError {
	constructor(index) {
		super('Syntatic error at ' + index);
		this.index = index;
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
