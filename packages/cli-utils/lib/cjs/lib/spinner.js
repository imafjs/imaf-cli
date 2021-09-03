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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.failSpinner = exports.resumeSpinner = exports.pauseSpinner = exports.stopSpinner = exports.logWithSpinner = void 0;
const ora_1 = __importDefault(require("ora"));
const chalk = __importStar(require("chalk"));
/**
 * 进度条
 */
const spinner = (0, ora_1.default)();
let lastMsg = null;
let isPaused = false;
function logWithSpinner(symbol, msg) {
    if (!msg) {
        msg = symbol;
        symbol = chalk.green('✔');
    }
    if (lastMsg) {
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text
        });
    }
    spinner.text = ' ' + msg;
    lastMsg = {
        symbol: symbol + ' ',
        text: msg
    };
    spinner.start();
}
exports.logWithSpinner = logWithSpinner;
function stopSpinner(persist) {
    if (!spinner.isSpinning) {
        return;
    }
    if (lastMsg && persist !== false) {
        spinner.stopAndPersist({
            symbol: lastMsg.symbol,
            text: lastMsg.text
        });
    }
    else {
        spinner.stop();
    }
    lastMsg = null;
}
exports.stopSpinner = stopSpinner;
function pauseSpinner() {
    if (spinner.isSpinning) {
        spinner.stop();
        isPaused = true;
    }
}
exports.pauseSpinner = pauseSpinner;
function resumeSpinner() {
    if (isPaused) {
        spinner.start();
        isPaused = false;
    }
}
exports.resumeSpinner = resumeSpinner;
function failSpinner(text) {
    spinner.fail(text);
}
exports.failSpinner = failSpinner;
