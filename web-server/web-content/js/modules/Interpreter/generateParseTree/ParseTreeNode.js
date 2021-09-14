class ParseTreeNode {
	constructor({ typeName, startsAt, endsAt, children, content }) {
		this.typeName = typeName;
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
	isToken() {
		const { content, children } = this;
		return (typeof content) === 'string' && children === null;
	}
}

module.exports = ParseTreeNode;
