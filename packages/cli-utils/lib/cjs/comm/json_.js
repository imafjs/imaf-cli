"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJsonItem = exports.stringify = exports.fromJson = exports.toJson = void 0;
const check_ = __importStar(require("./check_"));
function toJsonReplacer(key, value) {
    let val = value;
    // if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
    //     val = undefined;
    // }
    return val;
}
function toJson(obj, pretty) {
    if (check_.isUndefined(obj))
        return undefined;
    if (!check_.isNumber(pretty)) {
        pretty = pretty ? 2 : null;
    }
    return JSON.stringify(obj, toJsonReplacer, pretty);
}
exports.toJson = toJson;
function fromJson(json) {
    return check_.isString(json) ? JSON.parse(json) : json;
}
exports.fromJson = fromJson;
function stringify(value) {
    if (value == null) { // null || undefined
        return '';
    }
    const hasCustomToString = function (obj) {
        return check_.isFunction(obj.toString) && obj.toString !== Object.prototype.toString;
    };
    switch (typeof value) {
        case 'string':
            break;
        case 'number':
            value = '' + value;
            break;
        default:
            if (hasCustomToString(value) && !check_.isArray(value) && !check_.isDate(value)) {
                value = value.toString();
            }
            else {
                value = toJson(value);
            }
    }
    return value;
}
exports.stringify = stringify;
function parseJsonItem(json, itemRender) {
    if (!json)
        return null;
    if (check_.isString(json)) {
        json = fromJson(json);
    }
    if (check_.isArray(json)) {
        let items = [];
        for (let item of json) {
            items.push(itemRender(item));
        }
        return items;
    }
    return itemRender(json);
}
exports.parseJsonItem = parseJsonItem;
