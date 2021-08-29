class RuntimeError extends Error {}

class MemoryError extends RuntimeError {
	constructor(address, message) {
		super(message);
		this.address = address;
	}
}

class InvalidAddressAccess extends MemoryError {
	constructor(address) {
		super(address, `Invalid address access *(${address})`);
	}
}

class UnallocatedMemoryAccess extends MemoryError {
	constructor(address) {
		super(address, `Unallocated memory access *(${address})`);
	}
}

class UninitializedMemoryAccess extends MemoryError {
	constructor(address) {
		super(address, `Uninitialized memory access *(${address})`);
	}
}

module.exports.RuntimeError = RuntimeError;
module.exports.MemoryError = MemoryError;
module.exports.InvalidAddressAccess = InvalidAddressAccess;
module.exports.UninitializedMemoryAccess = UninitializedMemoryAccess;
