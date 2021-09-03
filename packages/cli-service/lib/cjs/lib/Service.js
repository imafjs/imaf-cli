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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const path = __importStar(require("path"));
const cli_utils_1 = require("@imaf/cli-utils");
const lodash_1 = require("lodash");
const debug_1 = require("debug");
const Instance_1 = require("./Instance");
const loadFileConfig_1 = require("./util/loadFileConfig");
const resolveUserConfig_1 = require("./util/resolveUserConfig");
/**
 * cli plugin servic
 */
class Service {
    // 是否初始化
    initialized = false;
    inlineOptions;
    // 上下文路径
    context;
    // 插件列表
    plugins;
    // 跳过插件
    pluginsToSkip;
    // 开发服务配置
    devServerConfigFns;
    // 命令集合
    commands;
    // plugin的package.json 
    pkg;
    // plugin的package.json 目录
    pkgContext;
    // 环境配置
    modes = {};
    // 当前环境
    mode;
    // 项目配置
    projectOptions;
    constructor(context, options = {}) {
        // process.MAF_CLI_SERVICE = this
        this.initialized = false;
        this.context = context;
        this.inlineOptions = options.inlineOptions;
        this.devServerConfigFns = [];
        this.commands = {};
        // Folder containing the target package.json for plugins
        this.pkgContext = context;
        // package.json containing the plugins
        this.pkg = this.resolvePkg(options.pkg);
        // If there are inline plugins, they will be used instead of those
        // found in package.json.
        // When useBuiltIn === false, built-in plugins are disabled. This is mostly
        // for testing.
        this.plugins = this.resolvePlugins(options.plugins, options.useBuiltIn);
        // pluginsToSkip will be populated during run()
        this.pluginsToSkip = new Set();
        // resolve the default mode to use for each command
        // this is provided by plugins as module.exports.defaultModes
        // so we can get the information without actually applying the plugin.
        this.modes = this.plugins.reduce((modes, pluginItem) => {
            return Object.assign(modes, pluginItem.defaultModes);
        }, {});
        this.mode = process.env.MAF_CLI_MODE;
        this.projectOptions = {};
    }
    /**
     * 处理pakcage.json
     * @param inlinePkg
     * @param context
     * @returns
     */
    resolvePkg(inlinePkg, context = this.context) {
        if (inlinePkg) {
            return inlinePkg;
        }
        const pkg = cli_utils_1.pkg.resolvePkg(context);
        if (pkg.mafPlugins && pkg.mafPlugins.resolveFrom) {
            this.pkgContext = path.resolve(context, pkg.mafPlugins.resolveFrom);
            return this.resolvePkg(undefined, this.pkgContext);
        }
        return pkg;
    }
    /**
     * 初始化
     * @param mode
     * @returns
     */
    init(mode = process.env.MAF_CLI_MODE) {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        this.mode = mode;
        // load mode .env
        if (mode) {
            this.loadEnv(mode);
        }
        // load base .env
        this.loadEnv();
        // load user config
        const userOptions = this.loadUserOptions();
        const loadedCallback = (loadedUserOptions) => {
            this.projectOptions = (0, lodash_1.defaultsDeep)(loadedUserOptions, {});
            (0, debug_1.debug)('MAF:project-config')(this.projectOptions);
            // apply plugins.
            this.plugins.forEach((pluginItem) => {
                if (this.pluginsToSkip.has(pluginItem.id))
                    return;
                pluginItem.apply(new Instance_1.PluginInstance(pluginItem.id, this), this.projectOptions);
            });
        };
        if (cli_utils_1.promise_.isPromise(userOptions)) {
            return userOptions.then(loadedCallback);
        }
        else {
            return loadedCallback(userOptions);
        }
    }
    /**
     * 加载环境配置
     * @param mode
     */
    loadEnv(mode) {
        // by default, NODE_ENV and BABEL_ENV are set to "development" unless mode
        // is production or test. However the value in .env files will take higher
        // priority.
        if (mode) {
            // always set NODE_ENV during tests
            // as that is necessary for tests to not be affected by each other
            const shouldForceDefaultEnv = (process.env.MAF_CLI_TEST &&
                !process.env.MAF_CLI_TEST_TESTING_ENV);
            const defaultNodeEnv = (mode === 'production' || mode === 'test')
                ? mode
                : 'development';
            if (shouldForceDefaultEnv || process.env.NODE_ENV == null) {
                process.env.NODE_ENV = defaultNodeEnv;
            }
        }
    }
    /**
     * 设置那些插件跳过
     * @param args
     */
    setPluginsToSkip(args) {
        const skipPlugins = args['skip-plugins'];
        const pluginsToSkip = skipPlugins
            ? new Set(skipPlugins.split(',').map((id) => cli_utils_1.pluginResolution.resolvePluginId(id)))
            : new Set();
        this.pluginsToSkip = pluginsToSkip;
    }
    /**
     * 解决渲染插件
     * @param inlinePlugins
     * @param useBuiltIn
     * @returns
     */
    resolvePlugins(inlinePlugins, useBuiltIn) {
        const idToPlugin = (id, absolutePath) => ({
            id: id.replace(/^.\//, 'built-in:'),
            apply: require(absolutePath || id)
        });
        let plugins;
        const builtInPlugins = [
            './commands/serve',
            './commands/build',
            './commands/inspect',
            './commands/help',
            // // config plugins are order sensitive
            // './config/base',
            // './config/assets',
            // './config/css',
            // './config/prod',
            // './config/app'
        ].map((id) => idToPlugin(id));
        if (inlinePlugins) {
            plugins = useBuiltIn !== false
                ? builtInPlugins.concat(inlinePlugins)
                : inlinePlugins;
        }
        else {
            const projectPlugins = Object.keys(this.pkg.devDependencies || {})
                .concat(Object.keys(this.pkg.dependencies || {}))
                .filter(cli_utils_1.pluginResolution.isPlugin)
                .map(id => {
                if (this.pkg.optionalDependencies &&
                    id in this.pkg.optionalDependencies) {
                    let apply = cli_utils_1.modules.loadModule(id, this.pkgContext);
                    if (!apply) {
                        cli_utils_1.logger.warn(`Optional dependency ${id} is not installed.`);
                        apply = () => { };
                    }
                    return { id, apply };
                }
                else {
                    return idToPlugin(id, cli_utils_1.modules.resolveModule(id, this.pkgContext));
                }
            });
            plugins = builtInPlugins.concat(projectPlugins);
        }
        // Local plugins
        if (this.pkg.mafPlugins && this.pkg.mafPlugins.service) {
            const files = this.pkg.MAFPlugins.service;
            if (!Array.isArray(files)) {
                throw new Error(`Invalid type for option 'MAFPlugins.service', expected 'array' but got ${typeof files}.`);
            }
            plugins = plugins.concat(files.map(file => ({
                id: `local:${file}`,
                apply: cli_utils_1.modules.loadModule(`./${file}`, this.pkgContext)
            })));
        }
        (0, debug_1.debug)('maf:plugins')(plugins);
        const orderedPlugins = cli_utils_1.pluginOrder.sortPlugins(plugins);
        (0, debug_1.debug)('maf:plugins-ordered')(orderedPlugins);
        return orderedPlugins;
    }
    async run(cmd, args = {}, rawArgv = []) {
        // resolve mode
        // prioritize inline --mode
        // fallback to resolved default modes from plugins or development if --watch is defined
        const mode = args.mode || (cmd === 'build' && args.watch ? 'development' : this.modes[cmd]);
        // --skip-plugins arg may have plugins that should be skipped during init()
        this.setPluginsToSkip(args);
        // load env variables, load user config, apply plugins
        await this.init(mode);
        args._ = args._ || [];
        let command = this.commands[cmd];
        if (!command && cmd) {
            cli_utils_1.logger.error(`command "${cmd}" does not exist.`);
            process.exit(1);
        }
        if (!command || args.help || args.h) {
            command = this.commands.help;
        }
        else {
            args._.shift(); // remove command itself
            rawArgv.shift();
        }
        const fn = command['fn'];
        return fn(args, rawArgv);
    }
    // Note: we intentionally make this function synchronous by default
    // because eslint-import-resolver-webpack does not support async webpack configs.
    loadUserOptions() {
        const { fileConfig, fileConfigPath } = (0, loadFileConfig_1.loadFileConfig)(this.context);
        if (cli_utils_1.promise_.isPromise(fileConfig)) {
            return fileConfig
                .then((mod) => mod.default)
                .then((loadedConfig) => (0, resolveUserConfig_1.resolveUserConfig)({
                inlineOptions: this.inlineOptions,
                pkgConfig: this.pkg.maf,
                fileConfig: loadedConfig,
                fileConfigPath
            }));
        }
        return (0, resolveUserConfig_1.resolveUserConfig)({
            inlineOptions: this.inlineOptions,
            pkgConfig: this.pkg.maf,
            fileConfig,
            fileConfigPath
        });
    }
}
exports.Service = Service;
