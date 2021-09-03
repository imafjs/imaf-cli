import { date_ } from "../../src"

test('date_ test format', ()=>{
    let date1 = date_.datetime()
    console.log(date1);
    let date2 = date_.datetime(new Date(), 'YYYY-MM-DD 00:00:00')
    console.log(date2);
    let date3 = date_.datetime(new Date(), 'YYYY-MM-DD')
    console.log(date3);
    
})