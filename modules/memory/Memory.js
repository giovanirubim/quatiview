const Chunk = require('./Chunk.js');
const {
	InvalidAddressAccess,
	UnallocatedMemoryAccess,
	UninitializedMemoryAccess,
} = require('../errors');

const NULL = 0;
const UNINITIALIZED_BYTE = Symbol('UNINITIALIZED_BYTE');

const pick = (arr) => arr[arr.length*Math.random() | 0];

class Memory {

	constructor() {
		this.firstAddress = 0x000fff;
		this.lastAddress  = 0xffffff;
		this.bytes = {};
		this.chunks = new Chunk({
			address: this.firstAddress,
			size: this.lastAddress - this.firstAddress,
		});
	}

	read(address) {
		if (address < this.firstAddress || address > this.lastAddress) {
			throw new InvalidAddressAccess(address);
		}
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
		if (address < this.firstAddress || address > this.lastAddress) {
			throw new InvalidAddressAccess(address);
		}
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

		chunk.allocate({ address, size });
		return address;
	}
}

const mem = new Memory();
console.log(mem);