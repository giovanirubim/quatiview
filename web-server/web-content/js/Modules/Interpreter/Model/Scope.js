export default class Scope {
    constructor(parent = null) {
        this.parent = parent;
    }
    get(name) {
        return this[name] ?? this.parent?.get(name) ?? null;
    }
    set(a, b) {
        if (typeof a === 'string') {
            this[a] = b;
            return;
        }
        if (a instanceof Object) {
            for (let name in a) {
                this.set(name, a[name]);
            }
        }
    }
}
