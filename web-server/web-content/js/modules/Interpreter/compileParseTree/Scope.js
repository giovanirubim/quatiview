export default class Scope {
    constructor(parent = null) {
        this.items = {};
        this.parent = parent;
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
        const scope = new Scope(this);
        return scope;
    }
}
