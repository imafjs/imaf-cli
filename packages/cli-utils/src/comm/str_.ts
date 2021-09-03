import * as check_ from './check_';

export function trim(value) {return check_.isString(value) ? value.trim() : value;};
export function lowercase(string) {return check_.isString(string) ? string.toLowerCase() : string;};
export function uppercase(string) {return check_.isString(string) ? string.toUpperCase() : string;};

export function camelCase(str) {
    if (str.indexOf('_') > -1) {
        str = str.replace(/_(\w)/g, (a, b) => {
            return b.toUpperCase();
        });
    }
    return str;
}