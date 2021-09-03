export function inArray(array, item) {
    return Array.prototype.indexOf.call(array, item) !== -1;
}

export function removeItem(array, item) {
    let index = array.indexOf(item);
    if (index >= 0) {
        array.splice(index, 1);
    }
    return index;
}
