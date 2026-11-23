/** Minimal structured (JSON-lines) logger. Never logs sensitive values. */

const LEVELS = Object.freeze({ debug: 10, info: 20, warn: 30, error: 40 });
const SENSITIVE_KEY = /(pass(word)?|secret|token|authoriz|api[-_]?key|credential|cookie)/i;

export function redact(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'string') return value.replace(/(\b\w+:\/\/)[^/@\s]+@/g, '$1***@');
    return value;
  }
  if (seen.has(value)) return '[circular]';
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => redact(item, seen));
  const out = {};
  for (const [key, item] of Object.entries(value)) {
    out[key] = SENSITIVE_KEY.test(key) ? '[redacted]' : redact(item, seen);
  }
  return out;
}

export function createLogger(name = 'app', level = 'info', sink = console) {
  const threshold = LEVELS[String(level).toLowerCase()] ?? LEVELS.info;
  function emit(lvl, message, meta = {}) {
    if (LEVELS[lvl] < threshold) return;
    const record = {
      ts: new Date().toISOString(),
      level: lvl.toUpperCase(),
      logger: name,
      msg: message,
      ...redact(meta),
    };
    const line = JSON.stringify(record);
    if (lvl === 'error') sink.error(line);
    else if (lvl === 'warn') sink.warn(line);
    else sink.log(line);
  }
  return {
    debug: (msg, meta) => emit('debug', msg, meta),
    info: (msg, meta) => emit('info', msg, meta),
    warn: (msg, meta) => emit('warn', msg, meta),
    error: (msg, meta) => emit('error', msg, meta),
  };
}

export { LEVELS };
