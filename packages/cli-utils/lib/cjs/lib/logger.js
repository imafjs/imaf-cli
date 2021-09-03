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
exports.clearConsole = exports.error = exports.warn = exports.done = exports.info = exports.log = exports.eventEmitter = void 0;
const chalk = __importStar(require("chalk"));
// 特殊版本6.0
const strip_ansi_1 = __importDefault(require("strip-ansi"));
const readline = __importStar(require("readline"));
const events = __importStar(require("events"));
const spinner_1 = require("./spinner");
exports.eventEmitter = new events.EventEmitter();
// const {stripAnsi} = ansi
/**
 * 输出日志
 * @param type
 * @param tag
 * @param message
 */
function _log(type, tag, message) {
    if (message) {
        exports.eventEmitter.emit('log', {
            message,
            type,
            tag
        });
    }
}
function format(label, msg) {
    return msg.split('\n').map((line, i) => {
        return i === 0
            ? `${label} ${line}`
            : line.padStart((0, strip_ansi_1.default)(label).length + line.length + 1);
    }).join('\n');
}
const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${msg} `);
function log(msg = '', tag = null) {
    tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
    _log('log', tag, msg);
}
exports.log = log;
function info(msg, tag = null) {
    console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
    _log('info', tag, msg);
}
exports.info = info;
function done(msg, tag = null) {
    console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
    _log('done', tag, msg);
}
exports.done = done;
function warn(msg, tag = null) {
    console.warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)));
    _log('warn', tag, msg);
}
exports.warn = warn;
function error(msg, tag = null) {
    (0, spinner_1.stopSpinner)(false);
    console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)));
    _log('error', tag, msg);
    if (msg instanceof Error) {
        console.error(msg.stack);
        _log('error', tag, msg.stack);
    }
}
exports.error = error;
function clearConsole(title) {
    if (process.stdout.isTTY) {
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        if (title) {
            console.log(title);
        }
    }
}
exports.clearConsole = clearConsole;
