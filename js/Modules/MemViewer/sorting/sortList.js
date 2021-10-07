export default (node, cellSize, x, y = 0) => {
    const { sx, sy } = node.template;
    let current_x = x;
    while (node !== null) {
        node.moveTo(current_x, y);
        current_x += cellSize;
        y += sy + cellSize;
        node = node.gData.children[0];
    }
    const limit_x = current_x - cellSize + sx;
    return { width: limit_x - x };
};
