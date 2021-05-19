import { Signal } from "../src"
import { assert } from "chai"

describe("signal", () => {
	it("wait for notify", async () => {
		const signal = new Signal
		setTimeout(() => signal.notify(), 0)
		await signal.wait()
	})

	it("wait forever", done => {
		const signal = new Signal

		let waited = true

		setTimeout(() => {
			assert(waited, "The wait function has not been executed")
			done()
		}, 20)

		signal.wait().then(() => {
			waited = false
		})
	})

	it("repeat", async () => {
		const signal = new Signal

		let count = 0
		await signal.repeat(async (cancel: Signal) => {
			count = count + 1

			if(count >= 10) {
				await cancel.notify()
			}
		})

		assert.equal(count, 10)
	})

	it("timeout", async () => {
		const signal = new Signal

		const TIMEOUT = 50
		const TOLERANCE = 10

		const start = Date.now()
		await signal.timeout(TIMEOUT)
		const end = Date.now()

		assert.isAbove(end, start + TOLERANCE)
	})

	it("timeout by cancel", async () => {
		const signal = new Signal

		const TIMEOUT = 50
		const TOLERANCE = 10

		setTimeout(() => signal.notify(), TIMEOUT / 2)
		const start = Date.now()
		await signal.timeout(TIMEOUT)
		const end = Date.now()

		assert.isAbove(end, start + TOLERANCE)
		assert.isBelow(end, start + TIMEOUT - TOLERANCE)
	})
})
