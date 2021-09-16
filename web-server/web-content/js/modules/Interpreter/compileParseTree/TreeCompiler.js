const treeCompilerSet = {};

export default class TreeCompiler {
    constructor({ nonTerminal, compile, execute }) {
        this.nonTerminal = nonTerminal;
        this.compile = compile;
        this.execute = execute;
        treeCompilerSet[nonTerminal] = this;
    }
    static compile(tree, context) {
        const treeCompiler = treeCompilerSet[tree.typeName];
        if (!treeCompiler) {
            throw `Tree compiler of ${tree.typeName} not found`;
        }
        return treeCompiler.compile(tree, context);
    }
    static execute(tree, context) {
        const treeCompiler = treeCompilerSet[tree.typeName];
        if (!treeCompiler) {
            throw `Tree compiler of ${tree.typeName} not found`;
        }
        if (!treeCompiler.execute) {
            throw `Tree compiler of ${tree.typeName} don't have an executor method`;
        }
        return treeCompiler.execute(tree, context);
    }
}
