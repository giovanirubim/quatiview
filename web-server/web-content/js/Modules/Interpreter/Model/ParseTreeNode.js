export default class ParseTreeNode {
	constructor({ name, startsAt, endsAt, content }) {
		this.name = name;
		this.startsAt = startsAt;
		this.endsAt = endsAt;
		this.content = content ?? null;
		this.length = this.endsAt - this.startsAt;
	}
}
