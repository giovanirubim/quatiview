export default class ParseTreeNode {
	constructor({ name, startsAt, endsAt, children, content }) {
		this.name = name;
		if (children != null) {
			let startsAt = Infinity;
			let endsAt = -Infinity;
			for (let child of children) {
				startsAt = Math.min(startsAt, child.startsAt);
				endsAt = Math.max(endsAt, child.endsAt);
			}
			this.startsAt = startsAt;
			this.endsAt = endsAt;
		} else {
			this.startsAt = startsAt;
			this.endsAt = endsAt;
		}
		this.content = content ?? null;
		this.length = this.endsAt - this.startsAt;
	}
}
