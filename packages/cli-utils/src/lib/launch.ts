import * as launcher from 'launch-editor'

/**
 * 用编辑器中的行号打开文件
 * 
 */
export function launch(...args){
    const file = args[0];
    console.log(`Opening ${file}...`)
    let callback = args[args.length-1]
    if(typeof callback != 'function'){
        callback = null;
    }
    launcher(...args, (fileName, errorMsg)=>{
        console.error(`Unable to open '${fileName}'`, errorMsg)
        console.log(`Try setting the EDITOR env variable. More info: https://github.com/yyx990803/launch-editor`)
        if(callback) callback(fileName, errorMsg)
    })
}

