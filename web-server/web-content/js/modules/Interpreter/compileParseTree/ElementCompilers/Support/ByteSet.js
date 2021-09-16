import project from '../../../../../Project.js';

export default class ByteSet {
    constructor({ data, varData, bytes, addr, size }) {
        this.varData = varData ?? data;
        this.bytes = bytes;
        this.addr = addr;
        this.size = size;
    }
    sendToDst(dst) {
        const { varData, bytes, addr, size } = this;
        if (varData) {
            project.memory.set(dst, varData.addr, varData.size);
        } else if (bytes) {
            project.memory.set(dst, bytes);
        } else {
            project.memory.copy(dst, addr, size);
        }
    }
    getAddr() {
        return this.varData?.addr ?? this.addr;
    }
    copyTo(target) {
        this.sendToDst(target.getAddr());
    }
}
