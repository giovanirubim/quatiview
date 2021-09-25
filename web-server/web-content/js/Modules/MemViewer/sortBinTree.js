const generateDataTree = (node, config) => {
    const width = config.getWidth(node);
    const node_l = config.getLeft(node);
    const node_r = config.getRight(node);
    const l = node_l ? generateDataTree(node_l, config) : null;
    const r = node_r ? generateDataTree(node_r, config) : null;
    if (l === null) {
        if (r === null) {
            return { node, l, r, tree_sx: width, root_cx: width*0.5 };
        }
        return { node, l, r, tree_sx: width*0.5 + r.tree_sx, root_cx: width*0.5 };
    }
    if (r !== null) {
        const tree_sx = l.tree_sx + config.xMargin + r.tree_sx;
        const root_cx = (l.root_cx + l.tree_sx + config.xMargin + r.root_cx)/2;
        return { node, l, r, tree_sx, root_cx };
    }
    return { node, l, r, tree_sx: l.tree_sx + width*0.5, root_cx: l.tree_sx };
};

const positionDataTree = (dataNode, x0, y0, config) => {
    const { node, l, r } = dataNode;
    const width = config.getWidth(node);
    const height = config.getHeight(node);
    const y1 = y0 + height + config.yMargin;
    config.setPos(node, x0 + dataNode.root_cx - width*0.5, y0);
    if (l !== null) {
        positionDataTree(l, x0, y1, config);
    }
    if (r !== null) {
        if (l !== null) {
            positionDataTree(r, x0 + l.tree_sx + config.xMargin, y1, config);
        } else {
            positionDataTree(r, x0 + width*0.5, y1, config);
        }
    }
};

export default (tree, config) => {
    if (tree != null) {
        const dataTree = generateDataTree(tree, config);
        positionDataTree(dataTree, 0, 0, config);
    }
};
