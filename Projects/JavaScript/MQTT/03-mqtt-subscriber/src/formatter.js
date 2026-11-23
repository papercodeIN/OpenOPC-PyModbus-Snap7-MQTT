/** Readable, bounded rendering of incoming MQTT messages. */

const MAX_FIELDS = 10;
const MAX_DEPTH = 3;

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

export function flattenScalars(value, prefix = '', out = [], depth = 0) {
  if (out.length >= MAX_FIELDS || depth > MAX_DEPTH) return out;
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) {
    out.push(`${prefix || 'value'}=${String(value)}`);
    return out;
  }
  if (Array.isArray(value)) {
    for (let index = 0; index < Math.min(10, value.length); index += 1) {
      flattenScalars(value[index], `${prefix}[${index}]`, out, depth + 1);
      if (out.length >= MAX_FIELDS) break;
    }
    return out;
  }
  if (typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      flattenScalars(child, prefix ? `${prefix}.${key}` : key, out, depth + 1);
      if (out.length >= MAX_FIELDS) break;
    }
  }
  return out;
}

export function formatMessage(record = {}, { jsonParsing = true, maxPayloadChars = 512 } = {}) {
  const text = decodePayload(record.payload);
  let kind = 'TEXT';
  let note = '';
  let fields = '';
  if (jsonParsing) {
    try {
      const parsed = JSON.parse(text);
      kind = 'JSON';
      const scalars = flattenScalars(parsed);
      if (scalars.length) fields = `\n  FIELDS: ${scalars.join('  ')}`;
    } catch {
      note = ' (not valid JSON — shown as plain text)';
    }
  }
  const safeText = text.replace(/[\r\n]+/g, '\\n');
  const shown = safeText.length > maxPayloadChars ? `${safeText.slice(0, maxPayloadChars)}…` : safeText;
  const timestamp = Number.isFinite(record.timestamp) ? new Date(record.timestamp).toISOString() : new Date().toISOString();
  return `[${timestamp}] QoS ${Number.isInteger(record.qos) ? record.qos : 0} ${record.topic ?? ''}\n  TYPE: ${kind}${note}\n  PAYLOAD: ${shown}${fields}`;
}
