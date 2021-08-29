const Chunk = require('./Chunk.js');
const UNINITIALIZED_BYTE = Symbol('UNINITIALIZED_BYTE');

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
	read() {
	}
}
