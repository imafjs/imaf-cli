import { Service } from './Service';
import { PluginAPI } from './API';
/**
 * Plugin Instance
 *
 */
declare class PluginInstance implements PluginAPI {
    id: string;
    service: Service;
    /**
     *
     * @param id - Id of the plugin.
     * @param servic - A maf-cli-service instance.
     */
    constructor(id: string, servic: Service);
    get version(): any;
    assertVersion(range: string | number): void;
    getCwd(): string;
    resolveProjectPath(_path: string): string;
    hasPlugin(id: string): boolean;
    registerCommand(name: string, opts: any, fn?: any): void;
    genCacheConfig(id: string, partialIdentifier: any, configFiles?: any): {
        cacheDirectory: string;
        cacheIdentifier: string;
    };
}
export { PluginInstance };
