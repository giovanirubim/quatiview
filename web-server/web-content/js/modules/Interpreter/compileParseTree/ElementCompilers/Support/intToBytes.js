export default (int) => {
    const bytes = [0, 0, 0, 0];
    for (let i=0; i<4; ++i) {
        bytes[i] = (int >> (i*8)) & 255;
    }
    return bytes;
};
