export class RuntimeError extends Error {}

export class InvalidAddressAccess extends RuntimeError {
	constructor(address) {
		super(`Address ${address} is invalid`);
		this.address = address;
	}
}

export class UnallocatedMemoryAccess extends RuntimeError {
	constructor(address) {
		super(`Address ${address} was not allocated`);
		this.address = address;
	}
}

export class UninitializedMemoryAccess extends RuntimeError {
	constructor(address) {
		super(`Address ${address} was not initialized`);
		this.address = address;
	}
}

export class FreeingInvalidAddress extends RuntimeError {
	constructor(address) {
		super(`Address ${address} was not allocated`);
		this.address = address;
	}
}

export class FreeingUnallocatedMemory extends RuntimeError {
	constructor(address) {
		super(`Address ${address} was not allocated`);
		this.address = address;
	}
}
