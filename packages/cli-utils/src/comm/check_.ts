export function isArray(arg) {
    if (Array.isArray) {
        return Array.isArray(arg);
    }
    return objectToString(arg) === '[object Array]';
}

export function isBoolean(arg) {
    return typeof arg === 'boolean';
}

export function isNull(arg) {
    return arg === null;
}

export function isNullOrUndefined(arg) {
    return arg == null;
}

export function isNumber(arg) {
    return typeof arg === 'number';
}

export function isString(arg) {
    return typeof arg === 'string';
}

export function isSymbol(arg) {
    return typeof arg === 'symbol';
}

export function isUndefined(arg) {
    return arg === void 0;
}

export function isRegExp(re) {
    return objectToString(re) === '[object RegExp]';
}

export function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
}

export function isDate(d) {
    return objectToString(d) === '[object Date]';
}

export function isError(e) {
    return (objectToString(e) === '[object Error]' || e instanceof Error);
}

export function isFunction(arg) {
    return typeof arg === 'function';
}

export function isPrimitive(arg) {
    return arg === null ||
        typeof arg === 'boolean' ||
        typeof arg === 'number' ||
        typeof arg === 'string' ||
        typeof arg === 'symbol' ||  // ES6 symbol
        typeof arg === 'undefined';
}

export function isDefined(value) {
    return typeof value !== 'undefined';
}

export function isTrueEmpty(obj) {
    if (obj === undefined || obj === null || obj === '') return true;
    return isNumber(obj) && isNaN(obj);
}
export function isEmpty(obj) {
    if (isTrueEmpty(obj)) return true;
    if (isRegExp(obj)) {
        return false;
    } else if (isDate(obj)) {
        return false;
    } else if (isError(obj)) {
        return false;
    } else if (isArray(obj)) {
        return obj.length === 0;
    } else if (isString(obj)) {
        return obj.length === 0;
    } else if (isNumber(obj)) {
        return obj === 0;
    } else if (isBoolean(obj)) {
        return !obj;
    } else if (isObject(obj)) {
        for (const key in obj) {
            return false && key; // only for eslint
        }
        return true;
    }
    return false;
}

function objectToString(o) {
    return Object.prototype.toString.call(o);
}
