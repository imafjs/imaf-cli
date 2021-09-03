import { PluginInstance, Service } from '../../src'



test('api', ()=>{

    const api = new PluginInstance('', new Service('/', {plugins : [], useBuiltIn:false}))
    api.id
    // console.log(api);
})

    // const api = new PluginAPI('11', new Service())
    
    // console.log(api.id);

