# Signal

A small library to manage asynchronous tasks using coroutines.

## Usage

```
npm i --save @evocount/signal
```

## Example

A signal lets you wait at a certain position of your code until the notify method is called.

```{javascript}
import Signal from "@evocount/signal"

(async () => {
	const signal = new Signal

	//call signal in 1s
	setTimeout(() => signal.notify(), 1000)

	//wait until notify is called
	await signal.wait()
})()
```

This can be used to send a cancel signal to a running loop.

E.g. Let a loop run for 1s.
```{javascript}
import Signal from "@evocount/signal"

(async () => {
	const signal = new Signal

	//notify the signal after 1s
	setTimeout(() => signal.notify(), 1000)

	await signal.repeat(async (cancel: Signal) => {
		//repeat this function until the signal is notified
	})
})()
```

You can also make this dependent on a shutdown event.
