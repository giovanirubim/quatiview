class RuntimeError extends Error {}

class MemoryError extends RuntimeError {
	constructor(address, message) {
		super(message);
		this.address = address;
	}
}

class InvalidAddress extends MemoryError {
	constructor(address) {
		super(address, `Invalid address ${address}`);
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

class FreeingUnallocatedMemory extends MemoryError {
	constructor(address) {
		super(address, `The address ${address} was not allocated`);
	}
}

class FreeingANonAllocationAddress extends MemoryError {
	constructor(address) {
		super(address, `The address ${address} is not an address of an allocation block`);
	}
}

module.exports.RuntimeError = RuntimeError;
module.exports.MemoryError = MemoryError;
module.exports.InvalidAddress = InvalidAddress;
module.exports.UninitializedMemoryAccess = UninitializedMemoryAccess;
module.exports.FreeingUnallocatedMemory = FreeingUnallocatedMemory;
module.exports.FreeingANonAllocationAddress = FreeingANonAllocationAddress;
