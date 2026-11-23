import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

import { parseArgs, helpText, run } from '../src/cli.js';
import { loadConfig, ConfigError } from '../src/config.js';

const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

test('parseArgs collects repeatable topics and flags', () => {
  const parsed = parseArgs(['--topic', 'a/#', '--topic=b/+', '--qos', '2', '--no-json', '--tls', '--max-chars', '100']);
  assert.equal(parsed.MQTT_TOPICS, 'a/#,b/+');
  assert.equal(parsed.MQTT_QOS, '2');
  assert.equal(parsed.MQTT_JSON_PARSING, 'false');
  assert.equal(parsed.MQTT_USE_TLS, 'true');
  assert.equal(parsed.MQTT_MAX_PAYLOAD_CHARS, '100');
});

test('parseArgs rejects invalid input', () => {
  assert.throws(() => parseArgs(['--bogus']), (e) => e instanceof ConfigError && /Unknown option/.test(e.message));
  assert.throws(() => parseArgs(['--port']), /requires a value/);
  assert.throws(() => parseArgs(['--tls=1']), /takes no value/);
  assert.throws(() => parseArgs(['x']), /Unexpected argument/);
});

test('parseArgs treats a bare number as the broker port', () => {
  const parsed = parseArgs(['1884', '--topic', 'a/#']);
  assert.equal(parsed.MQTT_PORT, '1884');
  assert.equal(parsed.MQTT_TOPICS, 'a/#');
});

test('helpText documents the CLI', () => {
  assert.match(helpText(), /--topic <filter>/);
  assert.match(helpText(), /--no-json/);
  assert.match(helpText(), /Ctrl\+C/);
});

function mockSubscriber() {
  return {
    connects: 0,
    ends: 0,
    onMessage: null,
    onEvent: null,
    async connect() {
      this.connects += 1;
    },
    async end() {
      this.ends += 1;
    },
  };
}

test('run waits for a shutdown signal and then shuts down cleanly', async () => {
  const subscriber = mockSubscriber();
  const signals = new EventEmitter();
  const pending = run(['--topic', 'cli/#'], {
    logger: silentLogger,
    subscriber,
    signals,
    loadConfigFromFile: (_path, overrides) => loadConfig({ MQTT_TOPICS: 'base/#', ...overrides }),
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  signals.emit('SIGINT');
  const code = await pending;
  assert.equal(code, 0);
  assert.equal(subscriber.connects, 1);
  assert.equal(subscriber.ends, 1);
  assert.equal(signals.listenerCount('SIGINT'), 0);
});

test('run returns 1 when connection fails and still ends the client', async () => {
  const subscriber = mockSubscriber();
  subscriber.connect = async () => { throw new Error('connection refused'); };
  const signals = new EventEmitter();
  const code = await run([], {
    logger: silentLogger,
    subscriber,
    signals,
    loadConfigFromFile: () => loadConfig({}),
  });
  assert.equal(code, 1);
  assert.equal(subscriber.ends, 1);
});
