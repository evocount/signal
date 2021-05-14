/**
 * A class to manage the flow of coroutines using signals.
 */
export default class Signal {
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
	async repeat(f: (cancel: Signal) => Promise<void>): Promise<void> {
		let cancelled = false

		this.chain(async () => {
			cancelled = true
		})

		while(!cancelled) {
			await f(this)
			await this.timeout(0)
		}
	}

	/**
	 * Wait for a given time period unless a signal is send.
	 */
	timeout(time: number): Promise<void> {
		return new Promise<void>(resolve => {
			let finished = false

			const timeout = setTimeout(() => {
				finished = true
				resolve()
			}, time)

			this.chain(async () => {
				if(!finished) {
					clearTimeout(timeout)
				}
			})
		})
	}
}

