let lastId = 0;

export default class Scope {
    constructor(parent = null, id = '1') {
        this.parent = parent;
        this.id = id;
        this.items = {};
        this.stackCount = 0;
    }
    get(itemName) {
        return this.items[itemName] ?? this.parent?.get?.(itemName) ?? null;
    }
    set(itemName, item) {
        const { items } = this;
        items[itemName] = item;
        return this;
    }
    stack() {
        const newId = this.id + '/' + (++this.stackCount);
        const scope = new Scope(this, newId);
        return scope;
    }
}
