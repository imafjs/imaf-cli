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
exports.checkEnvVersion = exports.getInstalledBrowsers = exports.runCmd = exports.OS = exports.hasMaven = exports.hasJava = exports.hasGit = exports.hasYarn = void 0;
const child_process_1 = require("child_process");
// import fs = require('fs')
// import path = require('path')
// import LRU = require('lru-cache')
const semver = __importStar(require("semver"));
const execSync_param = { stdio: 'ignore' };
let _hasYarn, _hasGit, _hasJava, _hasMaven;
/**
 * 环境是否存在
 * @param cmd 命令
 * @returns
 */
const hasENV = (cmd) => {
    try {
        (0, child_process_1.execSync)(cmd, execSync_param);
        return true;
    }
    catch (e) {
        return false;
    }
};
/**
 * 是否安装yarn
 * @returns
 */
function hasYarn() {
    if (_hasYarn != null) {
        return _hasYarn;
    }
    return (_hasYarn = hasENV('yarn --version'));
}
exports.hasYarn = hasYarn;
/**
 * 是否安装git
 */
function hasGit() {
    if (_hasGit != null) {
        return _hasGit;
    }
    return (_hasGit = hasENV('git --version'));
}
exports.hasGit = hasGit;
/**
 * 是否安装git
 */
function hasJava() {
    if (_hasJava != null) {
        return _hasJava;
    }
    return (_hasJava = hasENV('java -version'));
}
exports.hasJava = hasJava;
/**
 * 是否安装git
 */
function hasMaven() {
    if (_hasMaven != null) {
        return _hasMaven;
    }
    return (_hasMaven = hasENV('mvn --version'));
}
exports.hasMaven = hasMaven;
exports.OS = {
    isWin: process.platform === 'win32',
    isMac: process.platform === 'darwin',
    isLinux: process.platform === 'linux'
};
function runCmd(cmd) {
    try {
        return (0, child_process_1.execSync)(cmd, { stdio: [0, 'pipe', 'ignore'], timeout: 10000 }).toString().trim();
    }
    catch (e) {
        return '';
    }
}
exports.runCmd = runCmd;
function getLinuxAppVersion(binary) {
    return runCmd(`${binary} --version`).replace(/^.* ([^ ]*)/g, '$1');
}
function getMacAppVersion(bundleIdentifier) {
    const bundlePath = runCmd(`mdfind "kMDItemCFBundleIdentifier=='${bundleIdentifier}'"`);
    if (bundlePath) {
        return runCmd(`/usr/libexec/PlistBuddy -c Print:CFBundleShortVersionString ${bundlePath.replace(/(\s)/g, '\\ ')}/Contents/Info.plist`);
    }
    return null;
}
function getWinAppVersion(regQueryKey) {
    const queryResult = runCmd(regQueryKey);
    if (queryResult) {
        const metched = queryResult.match(/REG_SZ\s+(\S*)$/);
        return metched && metched[1];
    }
    return null;
}
const browsers = {
    chrome: '',
    firefox: ''
};
let checkedBrowsers = false;
/**
 * 获取已安装浏览器
 * @returns
 */
function getInstalledBrowsers() {
    if (checkedBrowsers) {
        return browsers;
    }
    checkedBrowsers = true;
    if (exports.OS.isLinux) {
        browsers.chrome = getLinuxAppVersion('google-chrome');
        browsers.firefox = getLinuxAppVersion('firefox');
    }
    else if (exports.OS.isMac) {
        browsers.chrome = getMacAppVersion('com.google.Chrome');
        browsers.firefox = getMacAppVersion('org.mozilla.firefox');
    }
    else if (exports.OS.isWin) {
        browsers.chrome = getWinAppVersion('reg query "HKLM\\Software\\Google\\Update\\Clients\\{8A69D345-D564-463c-AFF1-A69D9E530F96}" /v pv /reg:32');
        browsers.chrome = browsers.chrome || getWinAppVersion('reg query "HKCU\\Software\\Google\\Update\\Clients\\{8A69D345-D564-463c-AFF1-A69D9E530F96}" /v pv /reg:32');
        browsers.firefox = getWinAppVersion('reg query "HKLM\\Software\\Mozilla\\Mozilla Firefox" /v CurrentVersion');
    }
    return browsers;
}
exports.getInstalledBrowsers = getInstalledBrowsers;
/**
 * 检查Node环境版本
 */
function checkEnvVersion(versionInfo) {
    return semver.satisfies(process.version, versionInfo, { includePrerelease: true });
}
exports.checkEnvVersion = checkEnvVersion;
