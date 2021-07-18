import {
	InvalidAddressAccess,
	UnallocatedMemoryAccess,
	UninitializedMemoryAccess,
} from './errors.js';

const MIN_ADDRESS = 1024;
const MEM_SIZE = 16*1024;
const END_ADDRESS = MIN_ADDRESS + MEM_SIZE;
const MAX_ADDRESS = END_ADDRESS - 1;
const UNINITIALIZED_BYTE = Symbol();

const toWordSize = (x) => x = (x + 3) & ~3;
const randomByte = Math.random()*256 | 0;

class Slot {
	constructor(index, end) {
		this.index = index;
		this.end = end;
		this.length = end - index;
	}
}

class Memory {
	constructor() {
		this.byteMap = {};
		this.allocationMap = {};
	}
	#allocateBytes(start, end) {
		const { byteMap } = this;
		for (let i=start; i<end; ++i) {
			byteMap[i] = UNINITIALIZED_BYTE;
		}
	}
	#freeBytes(start, end) {
		const { byteMap } = this;
		for (let i=start; i<end; ++i) {
			delete byteMap[i];
		}
	}
	allocate(size) {
		const length = toWordSize(size);
		const { byteMap } = this;
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
			this.#allocateBytes(start, addr + 1);
			this.allocationMap[start] = length;
			return start;
		}
		return null;
	}
	free(address) {
		if (address === 0) {
			return;
		}
		const { allocationMap } = this;
		const length = allocationMap[address];
		if (length === undefined) {
			return 
		}
	}
	setByte(address, value) {
		const { byteMap } = this;
		if (address < MIN_ADDRESS || address > MAX_ADDRESS) {
			throw new InvalidAddressAccess(address);
		}
		if (byteMap[address] === undefined) {
			throw new UnallocatedMemoryAccess(address);
		}
		byteMap[address] = value;
	}
	getByte(address) {
		if (address < MIN_ADDRESS || address > MAX_ADDRESS) {
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
