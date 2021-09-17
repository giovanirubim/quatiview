let map = [];

export default class NonTerminal {
    constructor({ name, parse }) {
        this.name = name;
        this.parse = parse;
        map[name] = this;
    }
    static getByName(name) {
        return map[name] ?? null;
    }
}
