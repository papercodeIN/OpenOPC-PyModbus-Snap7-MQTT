import test from 'node:test';
import assert from 'node:assert/strict';

import { decodePayload, flattenScalars, formatMessage } from '../src/formatter.js';

test('decodePayload handles strings and typed arrays', () => {
  assert.equal(decodePayload('text'), 'text');
  assert.equal(decodePayload(new TextEncoder().encode('bytes')), 'bytes');
});

test('flattenScalars expands nested JSON fields up to the cap', () => {
  const fields = flattenScalars({ a: 1, nested: { b: true }, list: [2, 3] });
  assert.deepEqual(fields.slice(0, 4), ['a=1', 'nested.b=true', 'list[0]=2', 'list[1]=3']);
  assert.ok(flattenScalars(Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`k${i}`, i]))).length <= 10);
});

test('formatMessage renders JSON payloads with fields', () => {
  const out = formatMessage({ topic: 'sensors/1', qos: 1, timestamp: 0, payload: '{"temp":22.5,"ok":true}' });
  assert.match(out, /QoS 1 sensors\/1/);
  assert.match(out, /TYPE: JSON/);
  assert.match(out, /temp=22.5/);
  assert.match(out, /PAYLOAD: \{"temp":22.5,"ok":true\}/);
});

test('formatMessage falls back to plain text for malformed JSON', () => {
  const out = formatMessage({ topic: 't', qos: 0, payload: 'not json' });
  assert.match(out, /not valid JSON/);
  assert.match(out, /PAYLOAD: not json/);
});

test('formatMessage honours no-json mode, truncation and newlines', () => {
  const out = formatMessage({ topic: 't', qos: 2, payload: 'line1\nline2' }, { jsonParsing: false });
  assert.match(out, /TYPE: TEXT/);
  assert.match(out, /line1\\nline2/);
  assert.doesNotMatch(out, /FIELDS:/);
  const truncated = formatMessage({ topic: 't', qos: 0, payload: 'x'.repeat(100) }, { jsonParsing: false, maxPayloadChars: 20 });
  assert.match(truncated, /x{20}…/);
});
