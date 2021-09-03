// help.ts
import {PluginAPI, Options} from '../API'

export default (api: PluginAPI, options: Options) => {
    api.registerCommand(
        'help',
        {},
        args =>{
            const cmd = args._[0]
            console.log(cmd);
        }
    )
    // return;
}