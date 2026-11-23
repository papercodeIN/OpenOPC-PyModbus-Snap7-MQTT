/** Dependency-free canvas time-series chart for numeric MQTT metrics. */

const COLORS = Object.freeze({
  line: '#22d3ee',
  fill: 'rgba(34, 211, 238, 0.16)',
  grid: '#263d56',
  text: '#7b91a9',
  point: '#f5a524',
});

function timeLabel(timestamp) {
  const date = new Date(timestamp);
  return Number.isFinite(date.getTime())
    ? date.toLocaleTimeString([], { hour12: false })
    : '--:--:--';
}

export function createChart(canvas) {
  const ctx = canvas.getContext('2d');

  function render(points = [], options = {}) {
    const width = Math.max(1, canvas.clientWidth || canvas.parentElement?.clientWidth || 300);
    const height = Math.max(1, canvas.clientHeight || canvas.parentElement?.clientHeight || 200);
    const dpr = globalThis.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    if (!Array.isArray(points) || points.length === 0) return;

    const pad = { left: 54, right: 14, top: 14, bottom: 26 };
    const plotW = Math.max(1, width - pad.left - pad.right);
    const plotH = Math.max(1, height - pad.top - pad.bottom);
    const values = points.map((point) => point.value);
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (min === max) {
      min -= Math.abs(min) * 0.05 || 1;
      max += Math.abs(max) * 0.05 || 1;
    } else {
      const spread = (max - min) * 0.1;
      min -= spread;
      max += spread;
    }

    const xAt = (index) => pad.left + (points.length === 1 ? plotW / 2 : (index / (points.length - 1)) * plotW);
    const yAt = (value) => pad.top + plotH - ((value - min) / (max - min)) * plotH;

    ctx.lineWidth = 1;
    ctx.font = '10px Consolas, monospace';
    ctx.fillStyle = COLORS.text;
    ctx.strokeStyle = COLORS.grid;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i += 1) {
      const y = pad.top + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      const value = max - ((max - min) / 4) * i;
      ctx.fillText(formatValue(value), pad.left - 8, y);
    }

    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText(timeLabel(points[0].t), pad.left, height - pad.bottom + 8);
    ctx.textAlign = 'right';
    ctx.fillText(timeLabel(points[points.length - 1].t), width - pad.right, height - pad.bottom + 8);

    ctx.beginPath();
    points.forEach((point, index) => {
      const x = xAt(index);
      const y = yAt(point.value);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(xAt(points.length - 1), pad.top + plotH);
    ctx.lineTo(xAt(0), pad.top + plotH);
    ctx.closePath();
    ctx.fillStyle = COLORS.fill;
    ctx.fill();

    ctx.beginPath();
    points.forEach((point, index) => {
      const x = xAt(index);
      const y = yAt(point.value);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    const last = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(xAt(points.length - 1), yAt(last.value), 3.5, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.point;
    ctx.fill();

    if (options.label) {
      ctx.fillStyle = COLORS.text;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(options.label, pad.left + 4, 2);
    }
  }

  return { render };
}

function formatValue(value) {
  if (Math.abs(value) >= 1000) return value.toFixed(0);
  if (Math.abs(value) >= 10) return value.toFixed(1);
  return value.toFixed(2);
}
