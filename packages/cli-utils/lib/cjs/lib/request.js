"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postJSON = exports.getJSON = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * 代理请求
 */
function getJSON(url, opts) {
    const reqOpts = {
        method: 'GET',
        timeout: 30000,
        ...opts
    };
    return (0, node_fetch_1.default)(url, reqOpts).then(result => result.json());
}
exports.getJSON = getJSON;
function postJSON(url, opts) {
    const reqOpts = {
        method: 'POST',
        timeout: 30000,
        ...opts
    };
    return (0, node_fetch_1.default)(url, reqOpts).then(result => result.json());
}
exports.postJSON = postJSON;
