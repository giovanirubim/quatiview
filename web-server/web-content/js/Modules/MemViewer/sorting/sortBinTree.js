const prepare = (node, cellSize) => {
    const [ l, r ] = node.gData.children;
    const { sx } = node.template;
    if (l !== null) prepare(l, cellSize);
    if (r !== null) prepare(r, cellSize);
    if (l === null) {
        node.root_cx = sx*0.5;
        if (r === null) {
            node.tree_sx = node.template.sx;
        } else {
            node.tree_sx = sx*0.5 + r.tree_sx; 
        }
    } else {
        if (r === null) {
            node.root_cx = l.tree_sx;
            node.tree_sx = l.tree_sx + sx*0.5;
        } else {
            node.root_cx = l.tree_sx + cellSize;
            node.tree_sx = l.tree_sx + cellSize*2 + r.tree_sx;
        }
    }
};

const apply = (node, cellSize, x, y) => {
    const [ l, r ] = node.gData.children;
    const { sx, sy } = node.template;
    node.moveTo(x + node.root_cx - sx*0.5, y);
    const y1 = y + sy + cellSize;
    if (l !== null) {
        apply(l, cellSize, x, y1);
        if (r !== null) {
            apply(r, cellSize, x + l.tree_sx + cellSize*2, y1);
        }
    } else if (r !== null) {
        apply(r, cellSize, x + sx*0.5, y1);
    }
};

export default (root, cellSize, x, y = 0) => {
    prepare(root, cellSize);
    apply(root, cellSize, x, y);
    return { width: root.tree_sx };
};
