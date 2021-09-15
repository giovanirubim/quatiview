import TreeCompiler from './TreeCompiler.js';

import './ElementCompilers/compileConst.js';
import './ElementCompilers/compileFunDec.js';
import './ElementCompilers/compileId.js';
import './ElementCompilers/compileLocalLine.js';
import './ElementCompilers/compileOp0.js';
import './ElementCompilers/compileOp3.js';
import './ElementCompilers/compileOp4.js';
import './ElementCompilers/compileOp5.js';
import './ElementCompilers/compileOp6.js';
import './ElementCompilers/compileProgram.js';
import './ElementCompilers/compileScope.js';
import './ElementCompilers/compileVarDec.js';

export default (tree) => TreeCompiler.compile(tree, {});
