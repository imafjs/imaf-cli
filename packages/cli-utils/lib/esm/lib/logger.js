import * as chalk from 'chalk';
// 特殊版本6.0
import stripAnsi from 'strip-ansi';
import * as readline from 'readline';
import * as events from 'events';
import { stopSpinner } from './spinner';
export const eventEmitter = new events.EventEmitter();
// const {stripAnsi} = ansi
/**
 * 输出日志
 * @param type
 * @param tag
 * @param message
 */
function _log(type, tag, message) {
    if (message) {
        eventEmitter.emit('log', {
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
            : line.padStart(stripAnsi(label).length + line.length + 1);
    }).join('\n');
}
const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${msg} `);
export function log(msg = '', tag = null) {
    tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
    _log('log', tag, msg);
}
export function info(msg, tag = null) {
    console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
    _log('info', tag, msg);
}
export function done(msg, tag = null) {
    console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
    _log('done', tag, msg);
}
export function warn(msg, tag = null) {
    console.warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)));
    _log('warn', tag, msg);
}
export function error(msg, tag = null) {
    stopSpinner(false);
    console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)));
    _log('error', tag, msg);
    if (msg instanceof Error) {
        console.error(msg.stack);
        _log('error', tag, msg.stack);
    }
}
export function clearConsole(title) {
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
