"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberAllocator = void 0;
class NumberAllocator {
    used;
    min;
    max;
    lowWaterMark;
    constructor(min, max) {
        this.min = min;
        this.max = max;
        this.used = new Set();
        this.lowWaterMark = min;
    }
    firstVacant() {
        if (this.used.size === this.max - this.min + 1) {
            return null;
        }
        for (let i = this.lowWaterMark; i <= this.max; i++) {
            if (!this.used.has(i)) {
                return i;
            }
        }
        return null;
    }
    alloc() {
        if (this.used.size === this.max - this.min + 1) {
            return null;
        }
        for (let i = this.lowWaterMark; i <= this.max; i++) {
            if (!this.used.has(i)) {
                this.used.add(i);
                this.lowWaterMark = i + 1;
                return i;
            }
        }
        return null;
    }
    use(num) {
        if (num < this.min || num > this.max || this.used.has(num)) {
            return false;
        }
        this.used.add(num);
        return true;
    }
    free(num) {
        if (num < this.min || num > this.max) {
            return;
        }
        this.used.delete(num);
        if (num < this.lowWaterMark) {
            this.lowWaterMark = num;
        }
    }
    clear() {
        this.used.clear();
        this.lowWaterMark = this.min;
    }
}
exports.NumberAllocator = NumberAllocator;
//# sourceMappingURL=number-allocator.js.map