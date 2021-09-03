export function isPromise(fn) {
    let isPromise = false;
    try {
        isPromise = fn instanceof Promise;
    }
    catch (error) {
        isPromise = fn && typeof fn.then === 'function';
    }
    return isPromise;
}
