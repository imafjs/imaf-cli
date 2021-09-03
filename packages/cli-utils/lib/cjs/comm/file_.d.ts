/// <reference types="node" />
import * as fs from 'fs';
export declare function isExist(dir: any): boolean;
export declare function isFile(filePath: any): boolean;
export declare function isDirectory(filePath: any): boolean;
export declare function chmod(p: any, mode?: string): boolean;
export declare function mkdir(dir: any, mode?: string): any;
export declare function getdirFiles(dir: any, prefix?: string): any[];
export declare const getDirName: (p: string) => string;
export declare const getNormalize: (p: string) => string;
export declare const readFileSync: typeof fs.readFileSync;
export declare function getRootPath(): string;
export declare function getFileName(filePath: any): string;
export declare function getParentFileName(filePath: any): string;
export declare function getFileBasename(file: any): string;
export declare function pathJoin(...paths: any[]): string;
export declare function hasFile(dirPath: any, fileName: any): boolean;
