"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromise = void 0;
function isPromise(fn) {
    let isPromise = false;
    try {
        isPromise = fn instanceof Promise;
    }
    catch (error) {
        isPromise = fn && typeof fn.then === 'function';
    }
    return isPromise;
}
exports.isPromise = isPromise;
