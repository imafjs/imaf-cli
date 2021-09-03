import {hasYarn,hasGit,hasJava,hasMaven,OS,getInstalledBrowsers} from '../../src/lib/env'


test('env', ()=>{
    console.log('hasYarn ',hasYarn())
    console.log('hasGit', hasGit())
    console.log('_hasJava',hasJava())
    console.log('_hasMaven', hasMaven())
})

test('OS', ()=>{
    console.log(OS.isWin)
    console.log(OS.isMac)
    console.log(OS.isLinux)
})

test('instatlledBrowsers', ()=>{
    console.log(getInstalledBrowsers())
})

