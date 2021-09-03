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
exports.camelCase = exports.uppercase = exports.lowercase = exports.trim = void 0;
const check_ = __importStar(require("./check_"));
function trim(value) { return check_.isString(value) ? value.trim() : value; }
exports.trim = trim;
;
function lowercase(string) { return check_.isString(string) ? string.toLowerCase() : string; }
exports.lowercase = lowercase;
;
function uppercase(string) { return check_.isString(string) ? string.toUpperCase() : string; }
exports.uppercase = uppercase;
;
function camelCase(str) {
    if (str.indexOf('_') > -1) {
        str = str.replace(/_(\w)/g, (a, b) => {
            return b.toUpperCase();
        });
    }
    return str;
}
exports.camelCase = camelCase;
