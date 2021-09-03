import { ParsedArgs } from "minimist";
/**
 * 注册命令参数
 */
declare type RegisterCommandOpts = Partial<{
    description: string;
    usage: string;
    options: {
        [flags: string]: string;
    };
    details: string;
}>;
declare type RegisterCommandFn = (args: ParsedArgs, ...rawArgv: string[]) => any;
/**
 * 缓存配置信息
 */
interface CacheConfig {
    cacheDirectory: string;
    cacheIdentifier: string;
}
/**
 * Plugin API
 */
interface PluginAPI {
    id: string;
    service: any;
    readonly version: string;
    /**
     * 检查版本
     * @param range 1: 1.x; 2: 2.x.x ; ...
     */
    assertVersion(range: string | number): void;
    /**
     * 获取当前工作目录
     */
    getCwd(): string;
    /**
     * 根据ID查询是否存在此插件
     * @param id 插件ID
     */
    hasPlugin(id: string): boolean;
    /**
     * 处理项目路径
     * @param relative_path Relative path from project root
     */
    resolveProjectPath(relative_path: string): string;
    /**
     * 注册一条命令 可以用【maf-cli-service [name]】调用
     * @param name 命令名称
     * @param opts 命令参数
     * @param fn 回调函数
     */
    registerCommand(name: string, opts?: RegisterCommandOpts, fn?: RegisterCommandFn): void;
    /**
     * 生成缓存信息
     * @param id plugin di
     * @param partialIdentifier  cacheIdentifier
     * @param configFiles data or file content
     */
    genCacheConfig(id: string, partialIdentifier: any, configFiles?: string | string[]): CacheConfig;
}
/**
 * 项目配置信息
 */
interface Options {
    outputDir?: string;
    assetsDir?: string;
    pluginOptions?: object;
}
declare type OptionsConfig = () => Options;
declare type UserConfig = Options | OptionsConfig;
declare type userConfig = (config: UserConfig) => UserConfig;
/**
 * 服务插件
 */
declare type ServicePlugin = (api: PluginAPI, options: Options) => any;
export { RegisterCommandOpts, RegisterCommandFn, Options, OptionsConfig, userConfig, PluginAPI, ServicePlugin };
