import * as path from 'path';
import * as fs from 'fs';
// const rootPath = path.normalize(path.join(__dirname, '../../../'));
export function isExist(dir) {
    dir = path.normalize(dir);
    try {
        fs.accessSync(dir);
        return true;
    }
    catch (e) {
        return false;
    }
}
export function isFile(filePath) {
    if (!isExist(filePath))
        return false;
    try {
        const stat = fs.statSync(filePath);
        return stat.isFile();
    }
    catch (e) {
        return false;
    }
}
export function isDirectory(filePath) {
    if (!isExist(filePath))
        return false;
    try {
        const stat = fs.statSync(filePath);
        return stat.isDirectory();
    }
    catch (e) {
        return false;
    }
}
export function chmod(p, mode = '0777') {
    if (!isExist(p))
        return false;
    try {
        fs.chmodSync(p, mode);
        return true;
    }
    catch (e) {
        return false;
    }
}
export function mkdir(dir, mode = '0777') {
    if (isExist(dir))
        return chmod(dir, mode);
    const pp = path.dirname(dir);
    if (isExist(pp)) {
        try {
            fs.mkdirSync(dir, mode);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    if (mkdir(pp, mode))
        return mkdir(dir, mode);
    return false;
}
export function getdirFiles(dir, prefix = '') {
    dir = path.normalize(dir);
    if (!fs.existsSync(dir))
        return [];
    const files = fs.readdirSync(dir);
    let result = [];
    files.forEach(item => {
        const currentDir = path.join(dir, item);
        const stat = fs.statSync(currentDir);
        if (stat.isFile()) {
            result.push(path.join(prefix, item));
        }
        else if (stat.isDirectory()) {
            const cFiles = getdirFiles(currentDir, path.join(prefix, item));
            result = result.concat(cFiles);
        }
    });
    return result;
}
export const getDirName = path.dirname;
export const getNormalize = path.normalize;
export const readFileSync = fs.readFileSync;
export function getRootPath() {
    return path.dirname(__dirname);
}
export function getFileName(filePath) {
    return getFileBasename(filePath);
}
export function getParentFileName(filePath) {
    return getFileBasename(path.dirname(filePath));
}
export function getFileBasename(file) {
    return path.basename(file, path.extname(file));
}
export function pathJoin(...paths) {
    let path_ = '';
    for (let item of paths) {
        if (Array.isArray(item)) {
            for (let subItem of item) {
                path_ = path.join(path_, subItem);
            }
        }
        else {
            path_ = path.join(path_, item);
        }
    }
    return path_;
}
export function hasFile(dirPath, fileName) {
    return fs.existsSync(path.join(dirPath, fileName));
}
