import * as path from 'path'

test('test', ()=>{
    console.log('jest test');
    console.log(path.join(__dirname, __filename));
    
})