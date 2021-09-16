import TreeCompiler from './TreeCompiler.js';

import './ElementCompilers/compileConst.js';
import './ElementCompilers/compileExpr.js';
import './ElementCompilers/compileFunDec.js';
import './ElementCompilers/compileId.js';
import './ElementCompilers/compileIf.js';
import './ElementCompilers/compileIndexAcc.js';
import './ElementCompilers/compileLocalLine.js';
import './ElementCompilers/compileOp0.js';
import './ElementCompilers/compileOp1.js';
import './ElementCompilers/compileOp2.js';
import './ElementCompilers/compileOp3.js';
import './ElementCompilers/compileOp4.js';
import './ElementCompilers/compileOp5.js';
import './ElementCompilers/compileOp6.js';
import './ElementCompilers/compileOp7.js';
import './ElementCompilers/compileOp8.js';
import './ElementCompilers/compileProgram.js';
import './ElementCompilers/compileReturn.js';
import './ElementCompilers/compileScope.js';
import './ElementCompilers/compileSizeof.js';
import './ElementCompilers/compileStructDec.js';
import './ElementCompilers/compileVarDec.js';

export default (tree) => TreeCompiler.compile(tree);
