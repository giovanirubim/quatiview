class ParseTreeNode {
	constructor({ type, startsAt, endsAt, children, content }) {
		this.type = type;
		if (children != null) {
			let startsAt = 0;
			let endsAt = 0;
			for (let child of children) {
				startsAt = Math.min(startsAt, child.startsAt);
				endsAt = Math.max(endsAt, child.endsAt);
			}
			this.startsAt = startsAt;
			this.endsAt = endsAt;
			this.children = children;
		} else {
			this.startsAt = startsAt;
			this.endsAt = endsAt;
			this.children = null;
		}
		this.content = content ?? null;
		this.length = this.endsAt - this.startsAt;
	}
}

module.exports = ParseTreeNode;
