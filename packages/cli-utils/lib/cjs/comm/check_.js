"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.isTrueEmpty = exports.isDefined = exports.isPrimitive = exports.isFunction = exports.isError = exports.isDate = exports.isObject = exports.isRegExp = exports.isUndefined = exports.isSymbol = exports.isString = exports.isNumber = exports.isNullOrUndefined = exports.isNull = exports.isBoolean = exports.isArray = void 0;
function isArray(arg) {
    if (Array.isArray) {
        return Array.isArray(arg);
    }
    return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;
function isBoolean(arg) {
    return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;
function isNull(arg) {
    return arg === null;
}
exports.isNull = isNull;
function isNullOrUndefined(arg) {
    return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;
function isNumber(arg) {
    return typeof arg === 'number';
}
exports.isNumber = isNumber;
function isString(arg) {
    return typeof arg === 'string';
}
exports.isString = isString;
function isSymbol(arg) {
    return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;
function isUndefined(arg) {
    return arg === void 0;
}
exports.isUndefined = isUndefined;
function isRegExp(re) {
    return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;
function isDate(d) {
    return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
function isError(e) {
    return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;
function isFunction(arg) {
    return typeof arg === 'function';
}
exports.isFunction = isFunction;
function isPrimitive(arg) {
    return arg === null ||
        typeof arg === 'boolean' ||
        typeof arg === 'number' ||
        typeof arg === 'string' ||
        typeof arg === 'symbol' || // ES6 symbol
        typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;
function isDefined(value) {
    return typeof value !== 'undefined';
}
exports.isDefined = isDefined;
function isTrueEmpty(obj) {
    if (obj === undefined || obj === null || obj === '')
        return true;
    return isNumber(obj) && isNaN(obj);
}
exports.isTrueEmpty = isTrueEmpty;
function isEmpty(obj) {
    if (isTrueEmpty(obj))
        return true;
    if (isRegExp(obj)) {
        return false;
    }
    else if (isDate(obj)) {
        return false;
    }
    else if (isError(obj)) {
        return false;
    }
    else if (isArray(obj)) {
        return obj.length === 0;
    }
    else if (isString(obj)) {
        return obj.length === 0;
    }
    else if (isNumber(obj)) {
        return obj === 0;
    }
    else if (isBoolean(obj)) {
        return !obj;
    }
    else if (isObject(obj)) {
        for (const key in obj) {
            return false && key; // only for eslint
        }
        return true;
    }
    return false;
}
exports.isEmpty = isEmpty;
function objectToString(o) {
    return Object.prototype.toString.call(o);
}
