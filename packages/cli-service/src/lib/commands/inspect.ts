// inspect.ts
import {PluginAPI, Options} from '../API'

export default (api: PluginAPI, options: Options) => {
    api.registerCommand(
        'inspect',
        {
            description: 'inspect internal webpack config',
            usage: 'vue-cli-service inspect [options] [...paths]',
            options: {
                '--mode': 'specify env mode (default: development)',
                '--rule <ruleName>': 'inspect a specific module rule',
                '--plugin <pluginName>': 'inspect a specific plugin',
                '--rules': 'list all module rule names',
                '--plugins': 'list all plugin names',
                '--verbose': 'show full function definitions in output',
                '--skip-plugins': 'comma-separated list of plugin names to skip for this run'
            }
        },
        args =>{
            // let response = {}
            return 'inspect ok'
        }
    )
    // return;
}