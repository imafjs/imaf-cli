import { str_ } from "../../src"

test('str_ test', ()=>{
    expect(str_.trim(' abc ')).toBe('abc')
    expect(str_.camelCase('user_first_name')).toBe('userFirstName')
    expect(str_.lowercase('UserName')).toBe('username')
    expect(str_.uppercase('user')).toBe('USER')
})