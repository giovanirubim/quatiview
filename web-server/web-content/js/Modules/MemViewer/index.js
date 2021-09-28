import ret from '../Interpreter/Run/Instructions/ret.js';
import Net from '../Net.js';
import sortBinTree from './sortBinTree.js';

let canvas = null;
let ctx = null;

const fontSize = 8;
const maxScale = 1.5;
const cellSize = 20;
const cellPadding = 1;
const dblCellPadding = 2;
const arrowTipSize = 2;
const lineWidth = 1.5;
const animationDuration = 500;
const instances = window.instances = [];
const transform = [1, 0, 0, 1, 0, 0];
const templates = {};

const color = {
	int: {
		bg: '#07f',
		text: '#fff',
	},
	def: {
		bg: '#777',
		text: '#fff',
	},
	ptrLine: '#fff',
	addr: '#ccc',
	instance: '#aaa',
};

let addrMap = {};
const pointers = [];
const animations = [];

const animate = (it) => {
	animations.push({ time: Date.now(), it });
};

const runAnimations = () => {
	const now = Date.now();
	const ongoing = [];
	for (let animation of animations) {
		const { time, start, end, it } = animation;
		const dt = now - time;
		const x = Math.min(1, dt/animationDuration);
		const y = (1 - Math.cos(x*Math.PI))/2;;
		it(y);
		if (x < 1) {
			ongoing.push(animation);
		}
	}
	if (ongoing.length < animations.length) {
		animations.length = 0;
		animations.push(...ongoing);
	}
};

const calcCentralizedZoom = () => {
	if (instances.length === 0) {
		return { scale: 1, dx: 0, dy: 0 };
	}
	const tsx = canvas[0].width;
	const tsy = canvas[0].height;
	const minMargin = Math.min(tsx, tsy)*0.1;
	let x0 = +Infinity;
	let x1 = -Infinity;
	let y0 = +Infinity;
	let y1 = -Infinity;
	for (let instance of instances) {
		let { x, y } = instance;
		const { sx, sy } = instance.template;
		x0 = Math.min(x0, x);
		x1 = Math.max(x1, x + sx);
		y0 = Math.min(y0, y);
		y1 = Math.max(y1, y + sy);
	}
	const sx = x1 - x0;
	const sy = y1 - y0;
	const xScale = (tsx - minMargin*2)/sx;
	const yScale = (tsy - minMargin*2)/sy;
	const scale = Math.min(maxScale, Math.min(xScale, yScale));
	const mx = (tsx - sx*scale)/2;
	const my = (tsy - sy*scale)/2;
	const dx = mx - x0*scale;
	const dy = my - y0*scale;
	return { scale, dx, dy };
};

const drawBlock = (x, y, sx, sy, color) => {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, sx, sy);
};

const getNewPosition = (template) => {
	if (instances.length === 0) {
		return { x: 0, y: 0 };
	}
	let max_y = -Infinity;
	let min_x = +Infinity;
	let max_x = -Infinity;
	for (let instance of instances) {
		max_y = Math.max(max_y, instance.real.y + instance.template.sy);
		max_x = Math.max(max_x, instance.real.x + instance.template.sx);
		min_x = Math.min(min_x, instance.real.x);
	}
	const x = (max_x + min_x)/2 - template.sx/2;
	const y = max_y + cellSize*2;
	return { x, y };
};

class StructTemplate {
    constructor(name) {
		this.name = name;
        this.members = [];
		this.sx = 0;
		this.sy = 0;
    }
	updateSize() {
		const { members } = this;
		let x0 = +Infinity;
		let x1 = -Infinity;
		let y0 = +Infinity;
		let y1 = -Infinity;
		for (let member of members) {
			x0 = Math.min(member.x, x0);
			x1 = Math.max(member.x + member.sx, x1);
			y0 = Math.min(member.y, y0);
			y1 = Math.max(member.y + member.sy, y1);
		}
		this.sx = x1 - x0;
		this.sy = y1 - y0;
	}
    member({ offset, type, col, row, length }) {
		const member = {
			offset,
			type,
			x: col*cellSize,
			y: row*cellSize,
			sx: length*cellSize,
			sy: cellSize,
		};
        this.members.push(member);
		this.updateSize();
		return this;
    }
	render(addr, x0, y0) {
		const { members, sx, sy } = this;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = color.instance;
		ctx.fillRect(x0 - cellPadding, y0 - cellPadding, sx + dblCellPadding, sy + dblCellPadding);
		for (let member of members) {
			const { type, sx, sy, offset } = member;
			const x = member.x + x0;
			const y = member.y + y0;
			const { text, bg } = color[type] ?? color.def;
			drawBlock(x + cellPadding, y + cellPadding, sx - dblCellPadding, sy - dblCellPadding, bg);
			ctx.fillStyle = text;
			ctx.font = `bold ${fontSize}px monospace`;
			const cx = x + sx*0.5;
			const cy = y + sy*0.5;
			const valAddr = addr + offset;
			const value = type === 'char' ? Net.memory.readSafe(valAddr) : Net.memory.readWordSafe(valAddr);
			if (value === null) {
				continue;
			}
			if (type === 'int') {
				const value = Net.memory.readWordSafe(addr + offset);
				ctx.fillText(value, cx, cy);
			} else if (type.endsWith('*')) {
				const value = Net.memory.readWordSafe(addr + offset);
				if (value === 0) {
					ctx.fillText('NULL', cx, cy);
				} else if (addrMap[value] === undefined) {
					ctx.fillText(value, cx, cy);
				} else {
					pointers.push({ cx, cy, addr: value });
				}
			}
		}
	}
}

class Instance {
	constructor(addr, template) {
		this.real = getNewPosition(template);
		this.animated = {
			x: 0,
			y: 0,
		};
		this.addr = addr;
		this.template = template;
		this.rendered = {
			x0: null,
			y0: null,
			x1: null,
			y1: null,
		};
	}
	get x() {
		return this.real.x + this.animated.x;
	}
	get y() {
		return this.real.y + this.animated.y;
	}
	render() {
		const { x, y, template, addr } = this;
		template.render(addr, x, y);
		ctx.textBaseline = 'bottom';
		ctx.textAlign = 'left';
		ctx.fillStyle = color.addr;
		ctx.font = `${fontSize}px monospace`;
		ctx.fillText(addr, x, y);
		this.rendered.x0 = x;
		this.rendered.y0 = y;
		this.rendered.x1 = x + template.sx;
		this.rendered.y1 = y + template.sy;
	}
	moveTo(x, y) {
		const { real, animated } = this;
		const dif_x = x - real.x;
		const dif_y = y - real.y;
		if (dif_x === 0 && dif_y === 0) {
			return;
		}
		real.x = x;
		real.y = y;
		animate((t) => {
			animated.x = dif_x*t - dif_x;
			animated.y = dif_y*t - dif_y;
		});
	}
}

const render = () => {
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.fillStyle = '#000';
	ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
	ctx.setTransform(...transform);
	pointers.length = 0;
	for (let instance of instances) {
		instance.render();
	}
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color.ptrLine;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	for (let { cx, cy, addr } of pointers) {
		const target = addrMap[addr];
		const x0 = cx;
		const y0 = cy;
		const x2 = target.x + target.template.sx*0.5;
		const y2 = target.y;
		const y1 = (y0 + y2)*0.5;
		const dir = (y2 - y0)/Math.abs(y2 - y0);
		ctx.beginPath();
		ctx.moveTo(x0, y0);
		ctx.bezierCurveTo(x0, y1, x2, y1, x2, y2);
		ctx.moveTo(x2 - arrowTipSize, y2 - dir*arrowTipSize);
		ctx.lineTo(x2, y2);
		ctx.lineTo(x2 + arrowTipSize, y2 - dir*arrowTipSize);
		ctx.stroke();
	}
};

const frame = () => {
	sortTrees();
	runAnimations();
	updateZoom();
	render();
	requestAnimationFrame(frame);
};

const updateZoom = () => {
	const { dx, dy, scale } = calcCentralizedZoom();
	transform[0] = transform[3] = scale;
	transform[4] = dx;
	transform[5] = dy;
};

const resize = () => {
	const parent = canvas.parent();
	const width = Number(parent.css('width').replace('px', ''));
	const height = Number(parent.css('height').replace('px', ''));
	canvas.attr({ width, height });
	updateZoom();
};

export const init = () => {

	canvas = $('canvas');
    ctx = canvas[0].getContext('2d');
	$(window).on('resize', resize);
	
	setTimeout(() => {
		resize();
		frame();
	}, 0);

};

export const clear = () => {
	addrMap = {};
	instances.length = 0;
	pointers.length = 0;
};

export const addStruct = (name) => {
	const template = new StructTemplate(name);
	templates[name] = template;
	return template;
};

const spread = (node, treeId) => {
	if (node === null || node.treeId !== null) {
		return null;
	}
	node.treeId = treeId;
	spread(node.l, treeId);
	spread(node.r, treeId);
	if (node.parent !== null) {
		return spread(node.parent, treeId);
	}
	return node;
};

// const addToGraph = (node, graphId, graph) => {
// 	graph.push(node);
// 	node.graphId = graphId;
// 	const { neighbors } = node;
// 	for (let other of neighbors) {
// 		if (other.graphId === null) {
// 			addToGraph(other, graphId, graph);
// 		}
// 	}
// };

// export const getGraphs = () => {
// 	const nodes = [];
// 	const map = {};
// 	for (let instance of instances) {
// 		const node = {
// 			addr: instance.addr,
// 			instance,
// 			neighbors: [],
// 			children: [],
// 			graphId: null,
// 		};
// 		map[instance.addr] = node;
// 		nodes.push(node);
// 	}
// 	for (let node of nodes) {
// 		const { instance, addr } = node;
// 		const { members } = instance.template;
// 		for (let { type, offset } of members) {
// 			if (!type.endsWith('*')) continue;
// 			const ptr = Net.memory.readWordSafe(addr + offset);
// 			if (ptr == null) {
// 				node.children.push(null);
// 			} else {
// 				const other = map[ptr];
// 				if (other == null) continue;
// 				node.children.push(other ?? null);
// 				node.neighbors.push(other);
// 				other.neighbors.push(node);
// 			}
// 		}
// 	}
// 	const graphs = [];
// 	for (let node of nodes) {
// 		if (node.graphId === null) {
// 			const graph = [];
// 			addToGraph(node, graphs.length + 1, graph);
// 			graphs.push(graph);
// 		}
// 	}
// 	return graphs;
// };

const sortTrees = () => {
	const nodes = instances.filter(instance => instance.template.name === 'binary_search_tree');
	const map = {};
	for (let ref of nodes) {
		map[ref.addr] = { ref, l: null, r: null, treeId: null, parent: null };
	}
	const trees = [];
	for (let { addr } of nodes) {
		const node = map[addr];
		node.l = map[Net.memory.readWordSafe(addr + 4)] ?? null;
		node.r = map[Net.memory.readWordSafe(addr + 8)] ?? null;
		if (node.l !== null) {
			node.l.parent = node;
		}
		if (node.r !== null) {
			node.r.parent = node;
		}
	}
	for (let { addr } of nodes) {
		const tree = spread(map[addr], trees.length + 1);
		if (tree !== null) {
			trees.push(tree);
		}
	}
	if (trees.length === 1) {
		sortBinTree(trees[0], {
			getLeft: (node) => node.l,
			getRight: (node) => node.r,
			getWidth: (node) => node.ref.template.sx,
			getHeight: (node) => node.ref.template.sy,
			yMargin: cellSize,
			xMargin: cellSize,
			setPos: (node, x, y) => node.ref.moveTo(x, y),
		});
	}
};

export const addInstance = (name, addr) => {
	const template = templates[name];
	if (template === undefined) {
		return;
	}
	const instance = new Instance(addr, template);
	addrMap[addr] = instance;
	instances.push(instance);
};

export const removeInstance = (addr) => {
	const instance = addrMap[addr];
	if (instance === undefined) {
		return;
	}
	delete addrMap[addr];
	const index = instances.indexOf(instance);
	instances.splice(index, 1);
};
