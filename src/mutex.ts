import { Semaphor } from "./semaphor"

export class Mutex {
	semaphor = new Semaphor

	set(value: boolean): void {
		this.semaphor.set(value ? 1 : 0)
	}

	get(): boolean {
		return this.semaphor.get() === 0 ? false : true
	}
}
