# array-to-events [![Build Status](https://travis-ci.org/jamestalmage/array-to-events.svg?branch=master)](https://travis-ci.org/jamestalmage/array-to-events)

> Push a series of events to an emitter. Useful for testing.


## Install

```
$ npm install --save array-to-events
```


## Usage

```js
import arrayToEvents from 'array-to-events';

arrayToEvents(targetEmitter, [
  ['foo', 'fooArg1', 'fooArg2'],
  ['bar', 'barArg1', 'barArg2']
]);

// pushes both a 'foo' and 'bar' event (with specified arguments) to the emitter.
```


## API

### arrayToEvents(targetEmitter, eventArray,  [options])

Returns: `stop` callback

Emit a series of events on `targetEmitter`. Depending on the specified options, events will be emitted synchronously or at specified intervals. In async mode, a `stop` callback is returned that, when called, will prevent further events from being emitted.

#### targetEmitter

*Required*<br>
Type: `EventEmitter`

The emitter where events will be pushed

#### eventArray

*Required*<br>
Type: `two dimensional array`

An array of event argument arrays. Must be a two dimensional array. The first value of each child array must be a `string` value with the event name. Additional array members will be passed as arguments when the array is triggered.

```
[
  ['foo', 1],
  ['bar', 2]
]
```

The above defines two events. First a `foo` event will be emitted with argument `1`. Then a `bar` event will be emitted with argument `2`.


#### options

##### sync

Type: `boolean`<br>
Default: *it depends*

If `true`, all events will be emitted immediately and synchronously, one right after the other. It defaults to `true` *unless* the `delay` option or `done` callback are specified (in which case it defaults to `false`). Explicitly setting it to `true` will cause the `delay` option to be ignored.


##### delay

Type: `a number or the string "immediate"`<br>
Default: `"immediate"`

If set to `"immediate"`, events fire asynchronously with a minimal delay in between (`setImmediate` is used to schedule the next event).

If set to a `number`, events are scheduled every `delay` milliseconds (via `setTimeout(nextEvent, opts.delay)`).

##### done

Type: `callback(error, finished)`

An optional callback to be executed when all events have finished. The first argument will contain any error thrown during execution (not currently implemented). The second argument (`finished`) will be `true` if every event was emitted, `false` if the event stream was stopped prematurely using the `stop` function.

## See Also

- [`events-to-array`](https://www.npmjs.com/package/events-to-array)

## License

MIT © [James Talmage](http://github.com/jamestalmage)
