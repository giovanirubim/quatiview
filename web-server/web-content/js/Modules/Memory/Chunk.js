export default class Chunk {
	constructor({
		prev = null,
		next = null,
		addr,
		size,
		allocated = false,
	}) {
		this.prev = prev;
		this.next = next;
		this.addr = addr;
		this.size = size;
		this.allocated = allocated;
		if (next !== null) {
			next.prev = this;
		}
		if (prev !== null) {
			prev.next = this;
		}
	}
	split(size) {
		const chunk = new Chunk({
			prev: this,
			next: this.next,
			allocated: this.allocated,
			addr: this.addr + size,
			size: this.size - size,
		});
		this.size = size;
		return chunk;
	}
	allocate(addr, size) {
		if (addr > this.addr) {
			const dif = addr - this.addr;
			const chunk = this.split(dif);
			return chunk.allocate(addr, size);
		}
		if (size < this.size) {
			this.split(size);
		}
		this.allocated = true;
		return this;
	}
	mergeWithNext() {
		this.size += this.next.size;
		this.next = this.next.next;
		if (this.next !== null) {
			this.next.prev = this;
		}
	}
	free() {
		this.allocated = false;
		if (this.next?.allocated === false) {
			this.mergeWithNext();
		}
		if (this.prev?.allocated === false) {
			this.prev.mergeWithNext();
		}
	}
	contains(addr) {
		return (addr >= this.addr) && (addr < this.addr + this.size);
	}
}
