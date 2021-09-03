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
exports.PluginInstance = void 0;
const cli_utils_1 = require("@imaf/cli-utils");
const path = __importStar(require("path"));
const hash_sum_1 = __importDefault(require("hash-sum"));
/**
 * Plugin Instance
 *
 */
class PluginInstance {
    id;
    service;
    /**
     *
     * @param id - Id of the plugin.
     * @param servic - A maf-cli-service instance.
     */
    constructor(id, servic) {
        this.id = id;
        this.service = servic;
    }
    get version() {
        return require('../../package.json').version;
    }
    assertVersion(range) {
        if (typeof range === 'number') {
            range = `^${range}.0.0-0`;
        }
        if (cli_utils_1.semver.satisfies(this.version, range, { includePrerelease: true }))
            return;
        throw new Error(`Require @maf/cli-service "${range}", but was loaded with "${this.version}".`);
    }
    getCwd() {
        return this.service.context;
    }
    resolveProjectPath(_path) {
        return path.resolve(this.service.context, _path);
    }
    hasPlugin(id) {
        return this.service.plugins.some((p) => cli_utils_1.pluginResolution.matchesPluginId(id, p.id));
    }
    registerCommand(name, opts, fn) {
        if (typeof opts === 'function') {
            fn = opts;
            opts = null;
        }
        this.service.commands[name] = { fn, opts: opts || {} };
    }
    genCacheConfig(id, partialIdentifier, configFiles = []) {
        const fs = require('fs');
        const cacheDirectory = this.resolveProjectPath(`node_modules/.cache/${id}`);
        // replace \r\n to \n generate consistent hash
        // const fmtFunc = (conf: any) => {
        //     if (typeof conf === 'function') {
        //       return conf.toString().replace(/\r\n?/g, '\n')
        //     }
        //     return conf
        // }
        const variables = {
            partialIdentifier,
            'cli-service': require('../package.json').version,
            env: process.env.NODE_ENV,
            test: !!process.env.MAF_CLI_TEST,
            config: []
        };
        try {
            variables['cache-loader'] = require('cache-loader/package.json').version;
        }
        catch (e) {
        }
        if (!Array.isArray(configFiles)) {
            configFiles = [configFiles];
        }
        configFiles = configFiles.concat([
            'package-lock.json',
        ]);
        const readConfig = (file) => {
            const absolutePath = this.resolveProjectPath(file);
            if (!fs.existsSync(absolutePath)) {
                return;
            }
            if (absolutePath.endsWith('.js')) {
                // should evaluate config scripts to reflect environment variable changes
                try {
                    return JSON.stringify(require(absolutePath));
                }
                catch (e) {
                    return fs.readFileSync(absolutePath, 'utf-8');
                }
            }
            else {
                return fs.readFileSync(absolutePath, 'utf-8');
            }
        };
        variables.configFiles = configFiles.map((file) => {
            const content = readConfig(file);
            return content && content.replace(/\r\n?/g, '\n');
        });
        const cacheIdentifier = (0, hash_sum_1.default)(variables);
        return { cacheDirectory, cacheIdentifier };
    }
}
exports.PluginInstance = PluginInstance;
