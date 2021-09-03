import { json_ } from "../../src"

test('json_ test ', ()=>{
    let obj = {a:1, b:'bb',c: true}
    let obj_json = json_.toJson(obj, 1)
    console.log(obj_json)
    console.log(json_.fromJson(obj_json));
    console.log(json_.fromJson(obj_json));

    let objs = [
        {a:1, b:'bb',c: true},
        {a:2, b:'cc',c: true},
        {a:3, b:'dd',c: false},
    ];
    json_.parseJsonItem(json_.toJson(objs), (item)=> console.log(item));
     
})