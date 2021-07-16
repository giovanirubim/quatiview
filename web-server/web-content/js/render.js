const TAU = Math.PI*2;

let ctx = null;
let dom = null;
let cellSize = 20;
let fontSize = 12;
let instances = [];
let backgroundColor = '#444';
let addressMap = {};

class Address {
	constructor(value) {
		this.value = value? value + '': 'NULL';
	}
	toString() {
		return this.value;
	}
	get target() {
		return addressMap[this.value] ?? null;
	}
}

const drawArrow = (ax, ay, bx, by) => {
	ctx.beginPath();
	ctx.moveTo(ax, ay);
	const midy = (ay*2 + by)/3;
	ctx.bezierCurveTo(ax, midy, bx, midy, bx, by);
	ctx.stroke();
};

class Grid {
	static fillArea({ x, y, width, height, color }) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, width, height);
		return this;
	}
	static calcPosition({ row, col }) {
		return {
			x: (col + 2)*cellSize,
			y: (row + 2)*cellSize,
		};
	}
	static calcPositionCenterTop({ row, col, nRows, nCols }) {
		return {
			x: (col + 2 + nCols/2)*cellSize,
			y: (row + 2)*cellSize,
		};
	}
	static calcArea({ row, col, nRows, nCols }) {
		return {
			x: (col + 2)*cellSize,
			y: (row + 2)*cellSize,
			width: nCols*cellSize,
			height: nRows*cellSize,
		};
	}
	static drawBlock({ row, col, nRows, nCols, color, content }) {
		const area = this.calcArea({ row, col, nRows, nCols });
		this.fillArea({ ...area, color });
		if (content != null) {
			const x = area.x + area.width/2;
			const y = area.y + area.height/2;
			ctx.fillStyle = '#fff';
			if (content instanceof Address && content.toString() !== 'NULL') {
				const { target } = content;
				const { x: x2, y: y2 } = Grid.calcPositionCenterTop(target);
				ctx.lineWidth = fontSize*0.2;
				ctx.strokeStyle = '#fff';
				ctx.beginPath();
				ctx.arc(x, y, fontSize*0.4, 0, TAU);
				ctx.fill();
				drawArrow(x, y, x2, y2);
			} else {
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.font = fontSize + 'px monospace';
				ctx.fillText(content.toString(), x, y);
			}
		}
		return area;
	}
	static writeAboveLeft({ row, col, text }) {
		const { x, y } = this.calcPosition({ row, col });
		ctx.fillStyle = '#ccc';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'bottom';
		ctx.font = fontSize + 'px monospace';
		ctx.fillText(text, x, y);
	}
}

class InfoBlock {
	constructor(length, value) {
		this.length = length;
	}
}

class AttributeTemplate {
	constructor({ row, col, size, color, getValue }) {
		this.row = row;
		this.col = col;
		this.nRows = 1;
		this.nCols = size;
		this.color = color;
		this.getValue = getValue;
	}
}

class StructureTemplate {
	constructor() {
		this.attributes = [];
		this.nRows = 0;
		this.nCols = 0;
	}
	add(args) {
		this.attributes.push(new AttributeTemplate(args));
		this.nRows = Math.max(args.row + 1, this.nRows);
		this.nCols = Math.max(args.col + args.size, this.nCols);
		return this;
	}
	render({ row, col, valueGetter }) {
		const { attributes } = this;
		const { length } = attributes;
		for (let i=0; i<length; ++i) {
			const attribute = attributes[i];
			Grid.drawBlock({
				row: attribute.row + row,
				col: attribute.col + col,
				nRows: attribute.nRows,
				nCols: attribute.nCols,
				color: attribute.color,
				content: valueGetter?.(i),
			});
		}
	}
}

class StructureInstance {
	constructor({ row, col, template, address, valueGetter }) {
		this.row = row;
		this.col = col;
		this.template = template;
		this.address = address;
		this.valueGetter = valueGetter;
		addressMap[address] = this;
	}
	get nRows() { return this.template.nRows; }
	get nCols() { return this.template.nCols; }
	render() {
		const { row, col, template, address, valueGetter } = this;
		template.render({ row, col, valueGetter });
		Grid.writeAboveLeft({ row, col, text: address });
		return this;
	}
}

let frameRequest = null;
export const renderFrame = () => {
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, dom.width, dom.height);
	instances.forEach((instance) => instance.render());
	frameRequest = requestAnimationFrame(renderFrame);
};

export const setCanvas = (canvas) => {
	dom = canvas;
	ctx = dom.getContext('2d');
};

export const resize = ({ width, height }) => {
	dom.width = width;
	dom.height = height;
};

export const start = () => {
	renderFrame();
};

const treeNodeTemplate = new StructureTemplate()
	.add({
		row: 0,
		col: 0,
		size: 4,
		color: '#a43',
	})
	.add({
		row: 1,
		col: 0,
		size: 2,
		color: '#0bf',
	})
	.add({
		row: 1,
		col: 2,
		size: 2,
		color: '#07f',
	});

const listNodeTemplate = new StructureTemplate()
	.add({
		row: 0,
		col: 0,
		size: 3,
		color: '#a43',
	})
	.add({
		row: 1,
		col: 0,
		size: 3,
		color: '#0bf',
	});

const addTreeNode = ({
	row, col, value, left, right, address 
}) => {
	const values = [value, left, right];
	const instance = new StructureInstance({
		row, col,
		template: treeNodeTemplate,
		address,
		valueGetter: (i) => values[i],
	});
	instances.push(instance);
};

const addListNode = ({
	row, col, value, next, address 
}) => {
	const values = [value, next];
	const instance = new StructureInstance({
		row, col,
		template: listNodeTemplate,
		address,
		valueGetter: (i) => values[i],
	});
	instances.push(instance);
};

addTreeNode({
	row: 0,
	col: 3,
	value: 5,
	left: new Address(1024),
	right: new Address(1402),
	address: 1624,
});

addTreeNode({
	row: 4,
	col: 0,
	value: 2,
	left: new Address(0),
	right: new Address(0),
	address: 1024,
});

addTreeNode({
	row: 4,
	col: 8,
	value: 9,
	left: new Address(0),
	right: new Address(0),
	address: 1402,
});

addListNode({
	row: 0,
	col: 16,
	address: new Address(2044),
	value: 1,
	next: new Address(2004),
});

addListNode({
	row: 4,
	col: 16,
	address: new Address(2004),
	value: 5,
	next: new Address(1288),
});

addListNode({
	row: 8,
	col: 16,
	address: new Address(1288),
	value: 5,
	next: new Address(0),
});
