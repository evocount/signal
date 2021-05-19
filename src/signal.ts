import { Mutex }from "./mutex"

/**
 * A class to manage the flow of coroutines using signals.
 */
export class Signal {
	private callback: () => Promise<void> = () => Promise.resolve()

	private chain(f: () => Promise<void>): void {
		const callback = this.callback
		this.callback = async () => {
			await callback()
			await f()
		}
	}

	/**
	 * Send a signal.
	 */
	public async notify(): Promise<void> {
		await this.callback()
		this.callback = () => Promise.resolve()
	}

	/**
	 * Wait until a signal is send.
	 */
	public wait(): Promise<void> {
		return new Promise(resolve => {
			this.chain(async () => resolve())
		})
	}

	/**
	 * Repeat a function until a signal is send.
	 */
	public async repeat(f: (cancel: Signal) => Promise<void>, timeout = 0): Promise<void> {
		let cancelled = false

		this.chain(async () => {
			cancelled = true
		})

		while(!cancelled) {
			const timeout_p = this.timeout(timeout)
			await f(this)
			await timeout_p
		}
	}

	/**
	 * Wait for a given time period unless a signal is send.
	 */
	public timeout(time: number): Promise<void> {
		return new Promise<void>(resolve => {
			let finished = false

			const timeout = setTimeout(() => {
				finished = true
				resolve()
			}, time)

			this.chain(async () => {
				if(!finished) {
					clearTimeout(timeout)
					resolve()
				}
			})
		})
	}

	async while(f: (stop: Mutex) => Promise<void>): Promise<void> {
		const stop = new Mutex

		this.chain(async () => {
			stop.set(true)
		})

		while(!stop.get()) {
			await f(stop)
		}
	}
}

