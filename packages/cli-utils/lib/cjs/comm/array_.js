"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItem = exports.inArray = void 0;
function inArray(array, item) {
    return Array.prototype.indexOf.call(array, item) !== -1;
}
exports.inArray = inArray;
function removeItem(array, item) {
    let index = array.indexOf(item);
    if (index >= 0) {
        array.splice(index, 1);
    }
    return index;
}
exports.removeItem = removeItem;
