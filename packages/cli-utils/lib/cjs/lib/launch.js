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
exports.launch = void 0;
const launcher = __importStar(require("launch-editor"));
/**
 * 用编辑器中的行号打开文件
 *
 */
function launch(...args) {
    const file = args[0];
    console.log(`Opening ${file}...`);
    let callback = args[args.length - 1];
    if (typeof callback != 'function') {
        callback = null;
    }
    launcher(...args, (fileName, errorMsg) => {
        console.error(`Unable to open '${fileName}'`, errorMsg);
        console.log(`Try setting the EDITOR env variable. More info: https://github.com/yyx990803/launch-editor`);
        if (callback)
            callback(fileName, errorMsg);
    });
}
exports.launch = launch;
