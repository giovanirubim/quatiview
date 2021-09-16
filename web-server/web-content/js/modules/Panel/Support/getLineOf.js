export default (source, index) => {
    let lineCount = 1;
    for (let i=0; i<index; ++i) {
        if (source[i] === '\n') ++ lineCount;
    }
    let a = index - 1, b = index;
    while (a >= 0 && source[a] !== '\n') {
        -- a;
    }
    while (b < source.length && source[b] !== '\n') {
        ++ b;
    }
    const line = source.substring(a + 1, b);
    return { lineCount, line, pos: index - a };
};
