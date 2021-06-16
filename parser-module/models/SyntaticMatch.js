export default class SyntaticMatch {
	constructor({ type, startsAt, endsAt, content }) {
		this.type = type;
		this.startsAt = startsAt;
		this.endsAt = endsAt;
		this.content = content;
	}
}
