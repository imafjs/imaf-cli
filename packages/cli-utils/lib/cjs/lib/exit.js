"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exit = exports.exportProcess = void 0;
exports.exportProcess = !process.env.MAF_CLI_TEST;
/**
 * exit 进程退出
 */
function exit(code) {
    if (exports.exportProcess) {
        process.exit(code);
    }
    else if (code > 0) {
        throw new Error(`Process exited with code ${code}`);
    }
}
exports.exit = exit;
