const treeCompilerSet = {}

export default class TreeCompiler {
    constructor({ nonTerminal, compile }) {
        this.nonTerminal = nonTerminal;
        this.compile = compile;
        treeCompilerSet[nonTerminal] = this;
    }
    static compile(tree, context) {
        const treeCompiler = treeCompilerSet[tree.typeName];
        if (!treeCompiler) {
            throw `Tree compiler of ${tree.typeName} not found`;
        }
        treeCompiler.compile(tree, context);
    }
}
