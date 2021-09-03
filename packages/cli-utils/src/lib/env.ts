import { execSync, CommonExecOptions } from 'child_process'
// import fs = require('fs')
// import path = require('path')
// import LRU = require('lru-cache')

import * as semver from 'semver'

const execSync_param: CommonExecOptions = { stdio: 'ignore' }

let _hasYarn, _hasGit, _hasJava, _hasMaven;

/**
 * 环境是否存在
 * @param cmd 命令
 * @returns 
 */
const hasENV = (cmd) => {
    try {
        execSync(cmd, execSync_param);
        return true
    } catch (e) {
        return false;
    }
}

/**
 * 是否安装yarn
 * @returns 
 */
export function hasYarn() {
    if (_hasYarn != null) {
        return _hasYarn
    }
    return (_hasYarn = hasENV('yarn --version'));
}

/**
 * 是否安装git
 */
export function hasGit() {
    if (_hasGit != null) {
        return _hasGit
    }
    return (_hasGit = hasENV('git --version'));
}

/**
 * 是否安装git
 */
export function hasJava() {
    if (_hasJava != null) {
        return _hasJava
    }
    return (_hasJava = hasENV('java -version'));
}

/**
 * 是否安装git
 */
export function hasMaven() {
    if (_hasMaven != null) {
        return _hasMaven
    }
    return (_hasMaven = hasENV('mvn --version'));
}




export const OS = {
    isWin: process.platform === 'win32',
    isMac: process.platform === 'darwin',
    isLinux: process.platform === 'linux'
}



export function runCmd(cmd) {
    try {
        return execSync(
            cmd,
            { stdio: [0, 'pipe', 'ignore'], timeout: 10000 }
        ).toString().trim();
    } catch (e) {
        return '';
    }
}


function getLinuxAppVersion(binary) {
    return runCmd(`${binary} --version`).replace(/^.* ([^ ]*)/g, '$1')
}

function getMacAppVersion(bundleIdentifier) {
    const bundlePath = runCmd(`mdfind "kMDItemCFBundleIdentifier=='${bundleIdentifier}'"`)

    if (bundlePath) {
        return runCmd(`/usr/libexec/PlistBuddy -c Print:CFBundleShortVersionString ${bundlePath.replace(/(\s)/g, '\\ ')}/Contents/Info.plist`)
    }
    return null;
}
function getWinAppVersion(regQueryKey) {
    const queryResult = runCmd(regQueryKey)
    if (queryResult) {
        const metched = queryResult.match(/REG_SZ\s+(\S*)$/)
        return metched && metched[1]
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
export function getInstalledBrowsers() {
    if (checkedBrowsers) {
        return browsers;
    }
    checkedBrowsers = true;
    if (OS.isLinux) {
        browsers.chrome = getLinuxAppVersion('google-chrome')
        browsers.firefox = getLinuxAppVersion('firefox')
    } else if (OS.isMac) {
        browsers.chrome = getMacAppVersion('com.google.Chrome')
        browsers.firefox = getMacAppVersion('org.mozilla.firefox')
    } else if (OS.isWin) {
        browsers.chrome = getWinAppVersion('reg query "HKLM\\Software\\Google\\Update\\Clients\\{8A69D345-D564-463c-AFF1-A69D9E530F96}" /v pv /reg:32')
        browsers.chrome = browsers.chrome || getWinAppVersion('reg query "HKCU\\Software\\Google\\Update\\Clients\\{8A69D345-D564-463c-AFF1-A69D9E530F96}" /v pv /reg:32')
        browsers.firefox = getWinAppVersion('reg query "HKLM\\Software\\Mozilla\\Mozilla Firefox" /v CurrentVersion')
    }
    return browsers;
}


/**
 * 检查Node环境版本
 */
export function checkEnvVersion(versionInfo) {
    return semver.satisfies(process.version, versionInfo, { includePrerelease: true })
}