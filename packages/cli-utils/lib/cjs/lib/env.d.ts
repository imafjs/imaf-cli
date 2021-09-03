/**
 * 是否安装yarn
 * @returns
 */
export declare function hasYarn(): any;
/**
 * 是否安装git
 */
export declare function hasGit(): any;
/**
 * 是否安装git
 */
export declare function hasJava(): any;
/**
 * 是否安装git
 */
export declare function hasMaven(): any;
export declare const OS: {
    isWin: boolean;
    isMac: boolean;
    isLinux: boolean;
};
export declare function runCmd(cmd: any): string;
/**
 * 获取已安装浏览器
 * @returns
 */
export declare function getInstalledBrowsers(): {
    chrome: string;
    firefox: string;
};
/**
 * 检查Node环境版本
 */
export declare function checkEnvVersion(versionInfo: any): boolean;
