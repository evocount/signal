export class Semaphor {
	value: number

	constructor() {
		this.value = 0
	}

	set(value: number): void {
		this.value = value
	}

	get(): number {
		return this.value
	}
}
