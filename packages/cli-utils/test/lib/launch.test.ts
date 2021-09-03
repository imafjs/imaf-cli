import {launch} from '../../src/lib/launch'

test('launch', ()=>{
// test
    launch('env.ts:1:2','text',(fileName, errorMsg) =>{ console.log(fileName)})
})