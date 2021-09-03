class Chunk {
	constructor({
		prev = null,
		next = null,
		allocated = false,
		address,
		size,
	}) {
		this.prev = prev;
		this.next = next;
		this.allocated = allocated;
		this.address = address;
		this.size = size;
	}
	allocate({ address, size }) {
		const end = this.address + this.size;
		const blockEnd = address + size;
		if (blockEnd < end) {
			const size = end - blockEnd;
			this.split({ size, allocated: false });
		}
		let chunk = this;
		if (address > this.address) {
			this.split({ size, allocated: true });
		} else {
			this.allocated = true;
		}
	}
	free() {
		this.allocated = false;
		if (this.next?.allocated === false) {
			this.merge();
		}
		if (this.prev?.allocated === false) {
			this.prev.merge();
		}
		return this;
	}
	split({ size, allocated }) {
		const end = this.address + this.size;
		const address = end - size;
		const chunk = new Chunk({
			prev: this,
			next: this.next,
			allocated,
			address,
			size,
		});
		this.next = chunk;
		this.size = address - this.address;
		return chunk;
	}
	merge() {
		const chunk = this.next;
		this.size += chunk.size;
		this.next = chunk.next;
		if (this.next) {
			this.next.prev = this;
		}
		return this;
	}
	contains(address) {
		const start = this.address;
		const end = start + this.size;
		return address >= start && address < end;
	}
}

module.exports = Chunk;
