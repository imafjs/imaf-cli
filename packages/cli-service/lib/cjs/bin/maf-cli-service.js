"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_utils_1 = require("@imaf/cli-utils");
const requiredVersion = require('../../package.json').engines.node;
// const leven = require('leven')
function checkNodeVersion(wanted, id) {
    if (!cli_utils_1.env.checkEnvVersion(wanted)) {
        console.log(cli_utils_1.chalk.red('You are using Node ' + process.version + ', but this version of ' + id +
            ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'));
        process.exit(1);
    }
}
/**
 * 检查Cli执行的Node环境版本
 */
checkNodeVersion(requiredVersion, '@maf/cli');
const minimist_1 = __importDefault(require("minimist"));
const Service_1 = require("../lib/Service");
const context = process.env.MAF_CLI_CONTEXT || process.cwd();
const service = new Service_1.Service(context);
const rawArgv = process.argv.slice(2);
const args = (0, minimist_1.default)(rawArgv, {
    boolean: [
        'help'
    ]
});
const command = args._[0];
service.run(command, args, rawArgv).catch(err => {
    cli_utils_1.logger.error(err);
    process.exit(1);
});
