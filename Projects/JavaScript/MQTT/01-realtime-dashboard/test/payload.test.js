import test from 'node:test';
import assert from 'node:assert/strict';

import { decodePayload, collectNumericMetrics, parsePayload, truncate } from '../public/js/payload.js';

test('decodePayload accepts strings, Uint8Array and ArrayBuffer', () => {
  assert.equal(decodePayload('hello'), 'hello');
  assert.equal(decodePayload(new TextEncoder().encode('abc')), 'abc');
  assert.equal(decodePayload(new TextEncoder().encode('xyz').buffer), 'xyz');
});

test('parsePayload extracts nested numeric metrics from JSON', () => {
  const payload = JSON.stringify({ temperature: 22.5, nested: { rpm: 1200, active: true }, label: 'ok' });
  const result = parsePayload(payload, { jsonParsing: true });
  assert.equal(result.kind, 'json');
  assert.deepEqual(result.metrics, [
    { key: 'temperature', value: 22.5 },
    { key: 'nested.rpm', value: 1200 },
  ]);
  assert.equal(result.error, null);
});

test('parsePayload handles arrays and ignores non-finite numbers', () => {
  const result = parsePayload('[1, null, 3]');
  assert.deepEqual(result.metrics, [
    { key: '[0]', value: 1 },
    { key: '[2]', value: 3 },
  ]);
  const bad = parsePayload('{"a": 1e999}');
  assert.deepEqual(bad.metrics, []);
});

test('parsePayload falls back to plain text when JSON parsing is disabled', () => {
  const result = parsePayload('{"a":1}', { jsonParsing: false });
  assert.equal(result.kind, 'text');
  assert.deepEqual(result.metrics, []);
  assert.equal(result.text, '{"a":1}');
  assert.equal(result.error, null);
});

test('parsePayload never throws on malformed or binary-ish payloads', () => {
  const result = parsePayload('{not json');
  assert.equal(result.kind, 'text');
  assert.match(result.error, /not valid JSON/);
  assert.equal(result.text, '{not json');
});

test('collectNumericMetrics caps output and depth', () => {
  const deep = { a: { b: { c: { d: { e: 1 } } } } };
  assert.deepEqual(collectNumericMetrics(deep), []);
  const many = Object.fromEntries(Array.from({ length: 80 }, (_, i) => [`k${i}`, i]));
  assert.equal(collectNumericMetrics(many).length, 50);
});

test('truncate shortens long payloads for display', () => {
  assert.equal(truncate('abc', 10), 'abc');
  assert.equal(truncate('abcdefghij', 5), 'abcde…');
});
