const Chunk = require('./Chunk.js');
const {
	InvalidAddress,
	UnallocatedMemoryAccess,
	UninitializedMemoryAccess,
	FreeingUnallocatedMemory,
	FreeingANonAllocationAddress,
} = require('../errors');

const NULL = 0;
const UNINITIALIZED_BYTE = Symbol('UNINITIALIZED_BYTE');

const pick = (arr) => arr[arr.length*Math.random() | 0];

class Memory {

	constructor() {
		this.firstAddress = 0x001000;
		this.lastAddress  = 0xffffff;
		this.bytes = {};
		this.chunks = new Chunk({
			address: this.firstAddress,
			size: this.lastAddress - this.firstAddress + 1,
		});
	}

	validateAddress(address) {
		if (address < this.firstAddress || address > this.lastAddress) {
			throw new InvalidAddress(address);
		}
	}

	read(address) {
		this.validateAddress(address);
		const value = this.bytes[address];
		if (value === undefined) {
			throw new UnallocatedMemoryAccess(address);
		}
		if (value === UNINITIALIZED_BYTE) {
			throw new UninitializedMemoryAccess(address);
		}
		return value;
	}

	write(address, value) {
		this.validateAddress(address);
		if (this.bytes[address] === undefined) {
			throw new UnallocatedMemoryAccess(address);
		}
		this.bytes[address] = value;
	}

	allocate(size) {

		// Round to a multiple of 4
		size = (size + 3) & ~3;

		// Get all free chunks that fit the amount of bytes
		const freeChunks = [];
		let node = this.chunks;
		while (node != null) {
			if (!node.allocated && node.size >= size) {
				freeChunks.push(node);
			}
			node = node.next;
		}

		// Pick a random selected chunk
		if (freeChunks.length === 0) {
			return NULL;
		}
		const chunk = pick(freeChunks);

		// Pick an address of a random word to allocate
		const amountOfWords = chunk.size/4 | 0;
		const word = amountOfWords*Math.random() | 0;
		const address = chunk.address + word*4;

		// Update chunk list
		chunk.allocate({ address, size });

		// Allocate bytes
		const end = address + size;
		const { bytes } = this;
		for (let i=address; i<end; ++i) {
			bytes[i] = UNINITIALIZED_BYTE;
		}

		return address;
	}

	free(address) {

		this.validateAddress(address);
		if (this.bytes[address] === undefined) {
			throw new FreeingUnallocatedMemory(address);
		}

		// Search for chunk that contains the address
		let chunk = this.chunks;
		while (chunk && address >= chunk.address) {
			if (chunk.contains(address)) {
				break;
			}
			chunk = chunk.next;
		}
		if (chunk === null) {
			throw new FreeingANonAllocationAddress(chunk);
		}

		// Free chunk found and corresponding bytes
		const { size } = chunk;
		chunk.free();
		const end = address + size;
		const { bytes } = this;
		for (let i=address; i<end; ++i) {
			delete bytes[i];
		}
	}
}

export default Memory;