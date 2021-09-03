"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFileConfig = void 0;
const fs = require('fs');
const path = require('path');
const isFileEsm = require('is-file-esm');
const cli_utils_1 = require("@imaf/cli-utils");
function loadFileConfig(context) {
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
            fileConfig = cli_utils_1.modules.loadModule(fileConfigPath, context);
        }
    }
    return {
        fileConfig,
        fileConfigPath
    };
}
exports.loadFileConfig = loadFileConfig;
