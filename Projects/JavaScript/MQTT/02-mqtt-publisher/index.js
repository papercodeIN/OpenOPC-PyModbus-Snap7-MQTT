#!/usr/bin/env node
/** Entry point: MQTT publisher CLI. */

import { run } from './src/cli.js';

run(process.argv.slice(2))
  .then((code) => process.exit(code))
  .catch((error) => {
    console.error(`Fatal: ${error.message}`);
    process.exit(1);
  });
