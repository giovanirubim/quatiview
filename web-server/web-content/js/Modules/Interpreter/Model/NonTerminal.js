let map = [];

export default class NonTerminal {
    constructor({ name, parse, compile }) {
        this.name = name;
        this.parse = parse;
        this.compile = compile;
        map[name] = this;
    }
    static getByName(name) {
        return map[name] ?? null;
    }
}
