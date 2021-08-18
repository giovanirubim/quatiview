class HeapItem {
	constructor(key, value, index) {
		this.key = key;
		this.value = value;
		this.index = index;
	}
}

export default class MaxHeap extends Array {
	#moveUp(index) {
		const item = this[index];
		const { key } = item;
		while (index !== 0) {
			const parentIndex = (index - 1) >> 1;
			const parent = this[parentIndex];
			if (parent.key >= key) {
				break;
			}
			this[index] = parent;
			parent.index = index;
			index = parentIndex;
		}
		item.index = index;
		this[index] = item;
		return index;
	}
	#moveDown(index) {
		const item = this[index];
		const { key } = item;
		const { length } = this;
		for (;;) {
			let childIndex = (index << 1) | 1;
			if (childIndex >= length) {
				break;
			}
			let child = this[childIndex];
			const otherIndex = childIndex + 1;
			if (otherIndex < length) {
				const other = this[otherIndex];
				if (other.key > child.key) {
					child = other;
					childIndex = otherIndex;
				}
			}
			if (child.key <= key) {
				break;
			}
			this[index] = child;
			child.index = index;
			index = childIndex;
		}
		item.index = index;
		this[index] = item;
		return index;
	}
	#updateIndex(index) {
		this.#moveDown(this.#moveUp(index));
	}
	push({ key, value }) {
		const index = this.length;
		const item = new HeapItem(key, value, index);
		this[index] = item;
		this.#updateIndex(index);
		return this;
	}
	pop() {
		if (this.length === 0) {
			return null;
		}
		const item = this[0];
		const last = this[this.length - 1];
		this.length -= 1;
		if (this.length === 0) {
			return item;
		}
		this[0] = last;
		this.#moveDown(0);
		return item;
	}
	top() {
		return this[0] ?? null;
	}
	update({ index }) {
		this.#updateIndex(index);
		return this;
	}
}
