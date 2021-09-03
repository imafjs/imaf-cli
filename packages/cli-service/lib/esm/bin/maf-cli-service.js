import { chalk, env, logger } from '@imaf/cli-utils';
const requiredVersion = require('../../package.json').engines.node;
// const leven = require('leven')
function checkNodeVersion(wanted, id) {
    if (!env.checkEnvVersion(wanted)) {
        console.log(chalk.red('You are using Node ' + process.version + ', but this version of ' + id +
            ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'));
        process.exit(1);
    }
}
/**
 * 检查Cli执行的Node环境版本
 */
checkNodeVersion(requiredVersion, '@maf/cli');
import minimist from 'minimist';
import { Service } from '../lib/Service';
const context = process.env.MAF_CLI_CONTEXT || process.cwd();
const service = new Service(context);
const rawArgv = process.argv.slice(2);
const args = minimist(rawArgv, {
    boolean: [
        'help'
    ]
});
const command = args._[0];
service.run(command, args, rawArgv).catch(err => {
    logger.error(err);
    process.exit(1);
});
