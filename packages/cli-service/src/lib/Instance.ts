import { semver, pluginResolution } from '@imaf/cli-utils'
import { Service } from './Service'
import * as path from 'path'
import { PluginAPI } from './API'
import hash from 'hash-sum'


/**
 * Plugin Instance 
 * 
 */
class PluginInstance implements PluginAPI{
    
    id: string
    service: Service
    

    /**
     * 
     * @param id - Id of the plugin.
     * @param servic - A maf-cli-service instance.
     */
    constructor(id: string, servic: Service){
        this.id = id
        this.service = servic
    }

    get version (){
        return require('../../package.json').version
    }
    
    assertVersion(range: string|number){
        if (typeof range === 'number'){
            range = `^${range}.0.0-0`
        }
        if (semver.satisfies(this.version, range, { includePrerelease: true })) return
        throw new Error(`Require @maf/cli-service "${range}", but was loaded with "${this.version}".`)
    }

    getCwd () {
        return this.service.context
    }


    resolveProjectPath (_path: string) {
        return path.resolve(this.service.context, _path)
    }

    hasPlugin (id: string) {
        return this.service.plugins.some((p: any) => pluginResolution.matchesPluginId(id, p.id))
    }

    registerCommand (name: string, opts: any, fn?: any) {
        if (typeof opts === 'function') {
          fn = opts
          opts = null
        }
        this.service.commands[name] = { fn, opts: opts || {} }
    }

    genCacheConfig (id:string, partialIdentifier: any, configFiles:any = []) {
        const fs = require('fs')
        const cacheDirectory = this.resolveProjectPath(`node_modules/.cache/${id}`)

        // replace \r\n to \n generate consistent hash
        // const fmtFunc = (conf: any) => {
        //     if (typeof conf === 'function') {
        //       return conf.toString().replace(/\r\n?/g, '\n')
        //     }
        //     return conf
        // }

        const variables: any = {
            partialIdentifier,
            'cli-service': require('../package.json').version,
            env: process.env.NODE_ENV,
            test: !!process.env.MAF_CLI_TEST,
            config: []
        }

      try {
        variables['cache-loader'] = require('cache-loader/package.json').version
      } catch (e) {
        
      }

      if (!Array.isArray(configFiles)) {
        configFiles = [configFiles]
      }
      configFiles = configFiles.concat([
        'package-lock.json',
      ])

      const readConfig = (file: any) => {
        const absolutePath = this.resolveProjectPath(file)
        if (!fs.existsSync(absolutePath)) {
          return
        }

        if (absolutePath.endsWith('.js')) {
          // should evaluate config scripts to reflect environment variable changes
          try {
            return JSON.stringify(require(absolutePath))
          } catch (e) {
            return fs.readFileSync(absolutePath, 'utf-8')
          }
        } else {
          return fs.readFileSync(absolutePath, 'utf-8')
        }
      }

      variables.configFiles = configFiles.map((file: any) => {
        const content = readConfig(file)
        return content && content.replace(/\r\n?/g, '\n')
      })

      const cacheIdentifier = hash(variables)
      return { cacheDirectory, cacheIdentifier }
    }
}

export {PluginInstance}