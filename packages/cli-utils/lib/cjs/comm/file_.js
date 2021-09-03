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
exports.hasFile = exports.pathJoin = exports.getFileBasename = exports.getParentFileName = exports.getFileName = exports.getRootPath = exports.readFileSync = exports.getNormalize = exports.getDirName = exports.getdirFiles = exports.mkdir = exports.chmod = exports.isDirectory = exports.isFile = exports.isExist = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// const rootPath = path.normalize(path.join(__dirname, '../../../'));
function isExist(dir) {
    dir = path.normalize(dir);
    try {
        fs.accessSync(dir);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isExist = isExist;
function isFile(filePath) {
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
exports.isFile = isFile;
function isDirectory(filePath) {
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
exports.isDirectory = isDirectory;
function chmod(p, mode = '0777') {
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
exports.chmod = chmod;
function mkdir(dir, mode = '0777') {
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
exports.mkdir = mkdir;
function getdirFiles(dir, prefix = '') {
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
exports.getdirFiles = getdirFiles;
exports.getDirName = path.dirname;
exports.getNormalize = path.normalize;
exports.readFileSync = fs.readFileSync;
function getRootPath() {
    return path.dirname(__dirname);
}
exports.getRootPath = getRootPath;
function getFileName(filePath) {
    return getFileBasename(filePath);
}
exports.getFileName = getFileName;
function getParentFileName(filePath) {
    return getFileBasename(path.dirname(filePath));
}
exports.getParentFileName = getParentFileName;
function getFileBasename(file) {
    return path.basename(file, path.extname(file));
}
exports.getFileBasename = getFileBasename;
function pathJoin(...paths) {
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
exports.pathJoin = pathJoin;
function hasFile(dirPath, fileName) {
    return fs.existsSync(path.join(dirPath, fileName));
}
exports.hasFile = hasFile;
