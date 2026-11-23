"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReactNativeBrowser = exports.isWebWorker = void 0;
const isStandardBrowserEnv = () => {
    if (typeof window !== 'undefined') {
        const electronRenderCheck = typeof navigator !== 'undefined' &&
            navigator.userAgent?.toLowerCase().indexOf(' electron/') > -1;
        if (electronRenderCheck && process?.versions) {
            const electronMainCheck = Object.prototype.hasOwnProperty.call(process.versions, 'electron');
            return !electronMainCheck;
        }
        return typeof window.document !== 'undefined';
    }
    return false;
};
const isWebWorkerEnv = () => Boolean(typeof self === 'object' &&
    self?.constructor?.name?.includes('WorkerGlobalScope') &&
    typeof Deno === 'undefined');
const isReactNativeEnv = () => typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
const isBrowser = isStandardBrowserEnv() || isWebWorkerEnv() || isReactNativeEnv();
exports.isWebWorker = isWebWorkerEnv();
exports.isReactNativeBrowser = isReactNativeEnv();
exports.default = isBrowser;
//# sourceMappingURL=is-browser.js.map