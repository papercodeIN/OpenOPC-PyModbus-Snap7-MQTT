/** Open the default browser once the local service is listening (opt-in via MQTT_OPEN=1). */

import { spawn } from 'node:child_process';

export function openBrowser(url, env = process.env) {
  if (env.MQTT_OPEN !== '1') return false;
  try {
    if (process.platform === 'win32') {
      // `start` is a cmd builtin; the empty title argument keeps the URL from becoming one.
      spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
    } else if (process.platform === 'darwin') {
      spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
    } else {
      spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
    }
    return true;
  } catch {
    return false;
  }
}
