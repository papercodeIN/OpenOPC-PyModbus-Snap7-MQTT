# worker-timers-broker

**The broker which is used by the worker-timers package.**

[![version](https://img.shields.io/npm/v/worker-timers-broker.svg?style=flat-square)](https://www.npmjs.com/package/worker-timers-broker)

## Usage

In most cases using this package via [`worker-timers`](https://github.com/chrisguttandin/worker-timers) is probably the most convenient choice.

However `worker-timers-broker` is published as a separate package on npm. It can be installed using the following command:

```shell
npm install worker-timers-broker
```

The package exports two functions.

### load()

The `load()` function can be used to create a custom instance of `worker-timers` by explicitly specifying the URL which points to the code of the [`worker-timers-worker`](https://github.com/chrisguttandin/worker-timers-worker) package.

```js
import { load } from 'worker-timers-broker';

const { clearInterval, clearTimeout, setInterval, setTimeout } = load('./the/worker-timers-worker/file');

const intervalId = setInterval(() => {
    // do something many times
}, 100);

clearInterval(intervalId);

const timeoutId = setTimeout(() => {
    // do something once
}, 100);

clearTimeout(timeoutId);
```

### wrap()

The `wrap()` function can be used to wrap a Web Worker instance which already runs the code of the [`worker-timers-worker`](https://github.com/chrisguttandin/worker-timers-worker) package.

In a project using [Vite](https://vite.dev) it can for example be used by leveraging [query suffixes](https://vite.dev/guide/features.html#import-with-query-suffixes).

```js
import { wrap } from 'worker-timers-broker';
import createWorkerTimersWorker from 'worker-timers-worker?worker';

const { clearInterval, clearTimeout, setInterval, setTimeout } = wrap(createWorkerTimersWorker());

const intervalId = setInterval(() => {
    // do something many times
}, 100);

clearInterval(intervalId);

const timeoutId = setTimeout(() => {
    // do something once
}, 100);

clearTimeout(timeoutId);
```

Please note the syntax for other build tools may vary.

## Security contact information

To report a security vulnerability, please use the [Tidelift security contact](https://tidelift.com/security). Tidelift will coordinate the fix and disclosure.
