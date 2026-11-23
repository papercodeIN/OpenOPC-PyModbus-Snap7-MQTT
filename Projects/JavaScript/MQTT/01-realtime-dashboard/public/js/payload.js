/** Payload decoding, JSON parsing and numeric metric extraction. */

const MAX_METRICS = 50;
const MAX_DEPTH = 4;
const MAX_ARRAY_ITEMS = 20;

export function decodePayload(payload) {
  if (typeof payload === 'string') return payload;
  if (payload instanceof ArrayBuffer) payload = new Uint8Array(payload);
  if (ArrayBuffer.isView(payload)) {
    return new TextDecoder('utf-8', { fatal: false }).decode(
      new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength),
    );
  }
  if (payload === null || payload === undefined) return '';
  return String(payload);
}

/** Flatten finite numbers from a parsed JSON value into chartable metrics. */
export function collectNumericMetrics(value, prefix = '', out = [], depth = 0) {
  if (out.length >= MAX_METRICS || depth > MAX_DEPTH) return out;
  if (typeof value === 'number') {
    if (Number.isFinite(value)) out.push({ key: prefix || 'value', value });
    return out;
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < Math.min(MAX_ARRAY_ITEMS, value.length); i += 1) {
      collectNumericMetrics(value[i], `${prefix}[${i}]`, out, depth + 1);
      if (out.length >= MAX_METRICS) break;
    }
    return out;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const path = prefix ? `${prefix}.${key}` : key;
      collectNumericMetrics(child, path, out, depth + 1);
      if (out.length >= MAX_METRICS) break;
    }
  }
  return out;
}

/**
 * Parse an MQTT payload safely. Always returns text; never throws.
 * `kind` is 'json' for valid JSON, 'text' for plain or unparseable payloads.
 */
export function parsePayload(payload, { jsonParsing = true } = {}) {
  const text = decodePayload(payload);
  if (!jsonParsing) {
    return { kind: 'text', text, parsed: null, metrics: [], error: null };
  }
  try {
    const parsed = JSON.parse(text);
    return { kind: 'json', text, parsed, metrics: collectNumericMetrics(parsed), error: null };
  } catch {
    return {
      kind: 'text',
      text,
      parsed: null,
      metrics: [],
      error: 'Payload is not valid JSON — shown as plain text.',
    };
  }
}

export function truncate(text, max = 400) {
  const value = String(text);
  return value.length > max ? `${value.slice(0, max)}…` : value;
}
