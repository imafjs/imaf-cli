import * as path from 'path'
import { pkg as pkgRender, promise_, pluginResolution, pluginOrder, modules, logger} from '@imaf/cli-utils'
import {defaultsDeep} from 'lodash'

import {debug} from 'debug'
import { PluginInstance } from './Instance'
import {loadFileConfig} from './util/loadFileConfig'
import {resolveUserConfig} from './util/resolveUserConfig'

// const isPromise = p => p && typeof p.then === 'function'
//
interface Command {
    [key: string]: object
    fn: Function
}
interface Commands {
    [key: string]: Command
}

/**
 * cli plugin servic 
 */
class Service {

    // 是否初始化
    initialized: boolean = false
    inlineOptions?: object 
    // 上下文路径
    context: string
    // 插件列表
    plugins: object[]
    // 跳过插件
    pluginsToSkip: Set<any>
    // 开发服务配置
    devServerConfigFns: (object | Function)[]
    // 命令集合
    commands: Commands
    // plugin的package.json 
    pkg: any
    // plugin的package.json 目录
    pkgContext: string
    // 环境配置
    modes: any = {}
    // 当前环境
    mode: string | undefined
    // 项目配置
    projectOptions: any

    constructor(context: string, options: { plugins: any[], pkg?: string, inlineOptions?: object , useBuiltIn: boolean} | any = {}) {
        // process.MAF_CLI_SERVICE = this
        this.initialized = false
        this.context = context
        this.inlineOptions = options.inlineOptions

        this.devServerConfigFns = []
        this.commands = {}
        // Folder containing the target package.json for plugins
        this.pkgContext = context
        // package.json containing the plugins
        this.pkg = this.resolvePkg(options.pkg)
        // If there are inline plugins, they will be used instead of those
        // found in package.json.
        // When useBuiltIn === false, built-in plugins are disabled. This is mostly
        // for testing.
        this.plugins = this.resolvePlugins(options.plugins, options.useBuiltIn)
        // pluginsToSkip will be populated during run()
        this.pluginsToSkip = new Set()
        // resolve the default mode to use for each command
        // this is provided by plugins as module.exports.defaultModes
        // so we can get the information without actually applying the plugin.
        this.modes = this.plugins.reduce((modes: object, pluginItem:any) => {
            return Object.assign(modes, pluginItem.defaultModes)
        }, {})
        this.mode = process.env.MAF_CLI_MODE
        this.projectOptions = {}
    }

    /**
     * 处理pakcage.json
     * @param inlinePkg 
     * @param context 
     * @returns 
     */
    resolvePkg(inlinePkg: string|undefined, context = this.context) : string {
        if (inlinePkg) {
            return inlinePkg
        }
        const pkg: any = pkgRender.resolvePkg(context)
        if (pkg.mafPlugins && pkg.mafPlugins.resolveFrom) {
            this.pkgContext = path.resolve(context, pkg.mafPlugins.resolveFrom)
            return this.resolvePkg(undefined, this.pkgContext)
        }
        return pkg
    }

    /**
     * 初始化
     * @param mode 
     * @returns 
     */
    init(mode = process.env.MAF_CLI_MODE) {
        if (this.initialized) {
            return
        }
        this.initialized = true
        this.mode = mode

        // load mode .env
        if (mode) {
            this.loadEnv(mode)
        }
        // load base .env
        this.loadEnv()

        // load user config
        const userOptions = this.loadUserOptions()
        const loadedCallback = (loadedUserOptions: any) => {
            this.projectOptions = defaultsDeep(loadedUserOptions, {})

            debug('MAF:project-config')(this.projectOptions)

            // apply plugins.
            this.plugins.forEach((pluginItem: any) => {
                if (this.pluginsToSkip.has(pluginItem.id)) return
                pluginItem.apply(new PluginInstance(pluginItem.id, this), this.projectOptions)
            })
        }

        if (promise_.isPromise(userOptions)) {
            return userOptions.then(loadedCallback)
        } else {
            return loadedCallback(userOptions)
        }
    }

    /**
     * 加载环境配置
     * @param mode 
     */
    loadEnv(mode?: string) {
         // by default, NODE_ENV and BABEL_ENV are set to "development" unless mode
        // is production or test. However the value in .env files will take higher
        // priority.
        if (mode) {
            // always set NODE_ENV during tests
            // as that is necessary for tests to not be affected by each other
            const shouldForceDefaultEnv = (
                process.env.MAF_CLI_TEST &&
                !process.env.MAF_CLI_TEST_TESTING_ENV
            )
            const defaultNodeEnv = (mode === 'production' || mode === 'test')
                ? mode
                : 'development'
            if (shouldForceDefaultEnv || process.env.NODE_ENV == null) {
                process.env.NODE_ENV = defaultNodeEnv
            }
        }
    }

    /**
     * 设置那些插件跳过
     * @param args 
     */
    setPluginsToSkip(args: any) {
        const skipPlugins = args['skip-plugins']
        const pluginsToSkip = skipPlugins
            ? new Set(skipPlugins.split(',').map((id:string )=> pluginResolution.resolvePluginId(id)))
            : new Set()

        this.pluginsToSkip = pluginsToSkip
    }

    /**
     * 解决渲染插件
     * @param inlinePlugins 
     * @param useBuiltIn 
     * @returns 
     */
    resolvePlugins(inlinePlugins: object[], useBuiltIn: boolean) {
        const idToPlugin = (id: string, absolutePath?:string) => ({
            id: id.replace(/^.\//, 'built-in:'),
            apply: require(absolutePath || id)
        })

        let plugins

        const builtInPlugins: object[] = [
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
        ].map((id: string) => idToPlugin(id))

        if (inlinePlugins) {
            plugins = useBuiltIn !== false
                ? builtInPlugins.concat(inlinePlugins)
                : inlinePlugins
        } else {
            const projectPlugins = Object.keys(this.pkg.devDependencies || {})
                .concat(Object.keys(this.pkg.dependencies || {}))
                .filter(pluginResolution.isPlugin)
                .map(id => {
                    if (
                        this.pkg.optionalDependencies &&
                        id in this.pkg.optionalDependencies
                    ) {
                        let apply = modules.loadModule(id, this.pkgContext)
                        if (!apply) {
                            logger.warn(`Optional dependency ${id} is not installed.`)
                            apply = () => { }
                        }

                        return { id, apply }
                    } else {
                        return idToPlugin(id, modules.resolveModule(id, this.pkgContext))
                    }
                })

            plugins = builtInPlugins.concat(projectPlugins)
        }

        // Local plugins
        if (this.pkg.mafPlugins && this.pkg.mafPlugins.service) {
            const files = this.pkg.MAFPlugins.service
            if (!Array.isArray(files)) {
                throw new Error(`Invalid type for option 'MAFPlugins.service', expected 'array' but got ${typeof files}.`)
            }
            plugins = plugins.concat(files.map(file => ({
                id: `local:${file}`,
                apply: modules.loadModule(`./${file}`, this.pkgContext)
            })))
        }
        debug('maf:plugins')(plugins)

        const orderedPlugins = pluginOrder.sortPlugins(plugins)
        debug('maf:plugins-ordered')(orderedPlugins)

        return orderedPlugins
    }

    async run(cmd: string, args: any = {}, rawArgv: string[] = []) {
        // resolve mode
        // prioritize inline --mode
        // fallback to resolved default modes from plugins or development if --watch is defined
        const mode = args.mode || (cmd === 'build' && args.watch ? 'development' : this.modes[cmd])

        // --skip-plugins arg may have plugins that should be skipped during init()
        this.setPluginsToSkip(args)

        // load env variables, load user config, apply plugins
        await this.init(mode)

        args._ = args._ || []
        let command: Command = this.commands[cmd]
        if (!command && cmd) {
            logger.error(`command "${cmd}" does not exist.`)
            process.exit(1)
        }
        if (!command || args.help || args.h) {
            command = this.commands.help
        } else {
            args._.shift() // remove command itself
            rawArgv.shift()
        }
        const fn:Function = command['fn']
        return fn(args, rawArgv)
    }


    // Note: we intentionally make this function synchronous by default
    // because eslint-import-resolver-webpack does not support async webpack configs.
    loadUserOptions() {
        const { fileConfig, fileConfigPath } = loadFileConfig(this.context)

        if (promise_.isPromise(fileConfig)) {
            return fileConfig
                .then((mod:any) => mod.default)
                .then((loadedConfig: any) => resolveUserConfig({
                    inlineOptions: this.inlineOptions,
                    pkgConfig: this.pkg.maf,
                    fileConfig: loadedConfig,
                    fileConfigPath
                }))
        }

        return resolveUserConfig({
            inlineOptions: this.inlineOptions,
            pkgConfig: this.pkg.maf,
            fileConfig,
            fileConfigPath
        })
    }
}

export { Service }