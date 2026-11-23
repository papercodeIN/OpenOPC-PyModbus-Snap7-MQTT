#!/usr/bin/env node
/**
 * Verifies that every project ships the same shared theme layer.
 *
 * The three applications are standalone (each has its own package.json and
 * node_modules), so the theme file is copied instead of imported. This check
 * makes sure the copies never drift: identical bytes, different content files.
 *
 * Usage: node tools/check-theme.mjs
 */

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const projects = [
  { name: '01 real-time dashboard', theme: '01-realtime-dashboard/public/css/theme.css', app: '01-realtime-dashboard/public/css/dashboard.css' },
  { name: '02 mqtt publisher', theme: '02-mqtt-publisher/public/css/theme.css', app: '02-mqtt-publisher/public/css/app.css' },
  { name: '03 mqtt subscriber', theme: '03-mqtt-subscriber/public/css/theme.css', app: '03-mqtt-subscriber/public/css/app.css' },
];

function digest(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

const rows = [];
// Shared layout pieces every app relies on; if one lives in a per-app file instead,
// another app silently loses the styling (this is how the About panels ended up
// stacked with touching borders).
const REQUIRED_SELECTORS = ['.about-grid', '.status-pill', '.panel-grid', '.data-table', '.event-log'];
const missing = [];
for (const project of projects) {
  const themePath = path.join(root, project.theme);
  const appPath = path.join(root, project.app);
  try {
    const theme = await readFile(themePath);
    const app = await readFile(appPath);
    const themeText = theme.toString('utf8');
    for (const selector of REQUIRED_SELECTORS) {
      if (!themeText.includes(selector)) missing.push(`${project.name}: ${selector} missing from theme.css`);
    }
    rows.push({ ...project, themeHash: digest(theme), appHash: digest(app), bytes: theme.length });
  } catch (error) {
    console.error(`[X] ${project.name}: ${error.message}`);
    process.exit(1);
  }
}

if (missing.length) {
  console.error('[X] Shared selectors are missing from the theme layer:');
  for (const line of missing) console.error(`    ${line}`);
  process.exit(1);
}

const reference = rows[0].themeHash;
let failed = false;

console.log('Shared theme layer (theme.css)');
for (const row of rows) {
  const match = row.themeHash === reference ? 'identical' : 'DIFFERENT';
  if (row.themeHash !== reference) failed = true;
  console.log(`  ${row.name.padEnd(24)} ${row.themeHash.slice(0, 16)}…  ${String(row.bytes).padStart(6)} B  ${match}`);
}

console.log('\nProject content layer (dashboard.css / app.css)');
for (const row of rows) {
  console.log(`  ${row.name.padEnd(24)} ${row.appHash.slice(0, 16)}…`);
}

if (failed) {
  console.error('\n[X] The shared theme has drifted between projects.');
  process.exit(1);
}

console.log('\n[ok] Same theme everywhere, different content per project.');
