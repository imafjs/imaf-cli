interface Command {
    [key: string]: object;
    fn: Function;
}
interface Commands {
    [key: string]: Command;
}
/**
 * cli plugin servic
 */
declare class Service {
    initialized: boolean;
    inlineOptions?: object;
    context: string;
    plugins: object[];
    pluginsToSkip: Set<any>;
    devServerConfigFns: (object | Function)[];
    commands: Commands;
    pkg: any;
    pkgContext: string;
    modes: any;
    mode: string | undefined;
    projectOptions: any;
    constructor(context: string, options?: {
        plugins: any[];
        pkg?: string;
        inlineOptions?: object;
        useBuiltIn: boolean;
    } | any);
    /**
     * 处理pakcage.json
     * @param inlinePkg
     * @param context
     * @returns
     */
    resolvePkg(inlinePkg: string | undefined, context?: string): string;
    /**
     * 初始化
     * @param mode
     * @returns
     */
    init(mode?: string): any;
    /**
     * 加载环境配置
     * @param mode
     */
    loadEnv(mode?: string): void;
    /**
     * 设置那些插件跳过
     * @param args
     */
    setPluginsToSkip(args: any): void;
    /**
     * 解决渲染插件
     * @param inlinePlugins
     * @param useBuiltIn
     * @returns
     */
    resolvePlugins(inlinePlugins: object[], useBuiltIn: boolean): any;
    run(cmd: string, args?: any, rawArgv?: string[]): Promise<any>;
    loadUserOptions(): any;
}
export { Service };
