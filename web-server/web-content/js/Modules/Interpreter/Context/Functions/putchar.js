const arg = { name: 'chr', type: 'char', size: 1, addr: [] };
const byte = { instruction: 'load', src: arg };
export default {
    name: 'putchar',
    returnType: 'void',
    args: [arg],
    run: { instruction: 'putchar', byte },
};
