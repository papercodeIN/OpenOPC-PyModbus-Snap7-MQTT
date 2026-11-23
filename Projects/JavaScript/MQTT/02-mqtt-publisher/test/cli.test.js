import test from 'node:test';
import assert from 'node:assert/strict';

import { parseArgs, helpText, run } from '../src/cli.js';
import { loadConfig, ConfigError } from '../src/config.js';

const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

test('parseArgs supports separated and inline values plus flags', () => {
  const parsed = parseArgs([
    '--host', 'broker.local',
    '--port=1884',
    '--json-payload', '{"a":1}',
    '--retain',
    '--loop',
    '--count', '3',
    '--tls',
  ]);
  assert.equal(parsed.MQTT_HOST, 'broker.local');
  assert.equal(parsed.MQTT_PORT, '1884');
  assert.equal(parsed.MQTT_PAYLOAD, '{"a":1}');
  assert.equal(parsed.MQTT_PAYLOAD_FORMAT, 'json');
  assert.equal(parsed.MQTT_RETAIN, 'true');
  assert.equal(parsed.MQTT_LOOP, 'true');
  assert.equal(parsed.MQTT_MAX_MESSAGES, '3');
  assert.equal(parsed.MQTT_USE_TLS, 'true');
});

test('parseArgs rejects unknown options, missing values and valued flags', () => {
  assert.throws(() => parseArgs(['--unknown', 'x']), (e) => e instanceof ConfigError && /Unknown option/.test(e.message));
  assert.throws(() => parseArgs(['--port']), /requires a value/);
  assert.throws(() => parseArgs(['--retain=true']), /takes no value/);
  assert.throws(() => parseArgs(['positional']), /Unexpected argument/);
});

test('parseArgs treats a bare number as the broker port', () => {
  const parsed = parseArgs(['1884', '--topic', 'a/b']);
  assert.equal(parsed.MQTT_PORT, '1884');
  assert.equal(parsed.MQTT_TOPIC, 'a/b');
});

test('helpText documents the CLI', () => {
  assert.match(helpText(), /--json-payload/);
  assert.match(helpText(), /--insecure/);
  assert.match(helpText(), /--loop/);
});

function mockPublisher() {
  return {
    connects: 0,
    ends: 0,
    published: [],
    failConnect: false,
    async connect() {
      this.connects += 1;
      if (this.failConnect) throw new Error('connection refused');
    },
    async publish(topic, value, options) {
      this.published.push({ topic, value, options });
    },
    async end() {
      this.ends += 1;
    },
  };
}

test('run publishes exactly one message by default and shuts down cleanly', async () => {
  const publisher = mockPublisher();
  const code = await run(['--topic', 'cli/topic', '--json-payload', '{"x":1}'], {
    logger: silentLogger,
    publisher,
    loadConfigFromFile: (_path, overrides) => loadConfig({ MQTT_TOPIC: 'base/topic', ...overrides }),
  });
  assert.equal(code, 0);
  assert.equal(publisher.connects, 1);
  assert.equal(publisher.published.length, 1);
  assert.equal(publisher.published[0].topic, 'cli/topic');
  assert.equal(publisher.published[0].options.format, 'json');
  assert.equal(publisher.ends, 1);
});

test('run returns a failure code when the broker connection fails', async () => {
  const publisher = mockPublisher();
  publisher.failConnect = true;
  const code = await run([], {
    logger: silentLogger,
    publisher,
    loadConfigFromFile: () => loadConfig({}),
  });
  assert.equal(code, 1);
  assert.equal(publisher.published.length, 0);
  assert.equal(publisher.ends, 1);
});

test('run respects an explicit bounded loop', async () => {
  const publisher = mockPublisher();
  const code = await run(['--loop', '--count', '2', '--interval', '1000'], {
    logger: silentLogger,
    publisher,
    loadConfigFromFile: (_path, overrides) => loadConfig({ ...overrides }),
  });
  assert.equal(code, 0);
  assert.equal(publisher.published.length, 2);
});
