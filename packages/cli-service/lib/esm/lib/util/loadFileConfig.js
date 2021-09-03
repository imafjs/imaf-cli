const fs = require('fs');
const path = require('path');
const isFileEsm = require('is-file-esm');
import { modules } from '@imaf/cli-utils';
export function loadFileConfig(context) {
    let fileConfig, fileConfigPath;
    const possibleConfigPaths = [
        process.env.MAF_CLI_SERVICE_CONFIG_PATH,
        './maf.config.js',
        './maf.config.ts',
    ];
    for (const p of possibleConfigPaths) {
        const resolvedPath = p && path.resolve(context, p);
        if (resolvedPath && fs.existsSync(resolvedPath)) {
            fileConfigPath = resolvedPath;
            break;
        }
    }
    if (fileConfigPath) {
        const { esm } = isFileEsm.sync(fileConfigPath);
        if (esm) {
            fileConfig = require(fileConfigPath);
        }
        else {
            fileConfig = modules.loadModule(fileConfigPath, context);
        }
    }
    return {
        fileConfig,
        fileConfigPath
    };
}
