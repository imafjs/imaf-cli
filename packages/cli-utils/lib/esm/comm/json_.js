import * as check_ from './check_';
function toJsonReplacer(key, value) {
    let val = value;
    // if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
    //     val = undefined;
    // }
    return val;
}
export function toJson(obj, pretty) {
    if (check_.isUndefined(obj))
        return undefined;
    if (!check_.isNumber(pretty)) {
        pretty = pretty ? 2 : null;
    }
    return JSON.stringify(obj, toJsonReplacer, pretty);
}
export function fromJson(json) {
    return check_.isString(json) ? JSON.parse(json) : json;
}
export function stringify(value) {
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
export function parseJsonItem(json, itemRender) {
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
