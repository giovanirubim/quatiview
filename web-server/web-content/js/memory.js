import {
	InvalidAddressAccess,
	UnallocatedMemoryAccess,
	UninitializedMemoryAccess,
	FreeingInvalidAddress,
	FreeingUnallocatedMemory,
} from './errors.js';

const MIN_ADDRESS = 1024;
const MEM_SIZE = 16*1024;
const END_ADDRESS = MIN_ADDRESS + MEM_SIZE;
const MAX_ADDRESS = END_ADDRESS - 1;
const UNINITIALIZED_BYTE = Symbol();

const toWordSize = (x) => x = (x + 3) & ~3;
const randomByte = Math.random()*256 | 0;
const invalidAddress = (addr) => addr < MIN_ADDRESS || addr > MAX_ADDRESS;

class Slot {
	constructor(index, end) {
		this.index = index;
		this.end = end;
		this.length = end - index;
	}
}

class Memory {
	#byteMap;
	#allocationMap;
	constructor() {
		this.#byteMap = {};
		this.#allocationMap = {};
	}
	#allocateBytes(start, end) {
		const byteMap = this.#byteMap;
		for (let i=start; i<end; ++i) {
			byteMap[i] = UNINITIALIZED_BYTE;
		}
	}
	#freeBytes(start, end) {
		const byteMap = this.#byteMap;
		for (let i=start; i<end; ++i) {
			delete byteMap[i];
		}
	}
	#addressIsAllocated(address) {
		return this.#byteMap[address] !== undefined;
	}
	allocate(size) {
		const length = toWordSize(size);
		const byteMap = this.#byteMap;
		const allocationMap = this.#allocationMap;
		let amount = 0;
		for (let addr=MIN_ADDRESS; addr<END_ADDRESS; ++addr) {
			if (byteMap[addr] !== undefined) {
				amount = 0;
				continue;
			}
			if (++amount !== length) {
				continue;
			}
			const start = addr - length + 1;
			const end = addr + 1;
			this.#allocateBytes(start, end);
			allocationMap[start] = end;
			return start;
		}
		return null;
	}
	free(address) {
		if (address === 0) {
			return;
		}
		if (invalidAddress(address)) {
			throw new FreeingInvalidAddress(address);
		}
		const byteMap = this.#byteMap;
		const allocationMap = this.#allocationMap;
		if (!this.#addressIsAllocated(address)) {
			throw new FreeingUnallocatedMemory(address);
		}
		const end = allocationMap[address];
		if (end === undefined) {
			throw new FreeingInvalidAddress(address);
		}
		this.#freeBytes(address, end);
	}
	setByte(address, value) {
		const byteMap = this.#byteMap;
		if (invalidAddress(address)) {
			throw new InvalidAddressAccess(address);
		}
		if (byteMap[address] === undefined) {
			throw new UnallocatedMemoryAccess(address);
		}
		byteMap[address] = value;
	}
	getByte(address) {
		if (invalidAddress(address)) {
			throw new InvalidAddressAccess(address);
		}
		const byte = this.byteMap[address];
		if (byte === undefined) {
			throw new UnallocatedMemoryAccess(address);
		}
		if (byte === UNINITIALIZED_BYTE) {
			throw new UninitializedMemoryAccess(address);
		}
		return byte;
	}
}

window.mem = new Memory();
