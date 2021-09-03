import { validate } from "../../src";


test('validate test', () => {
    // test
    const schema = validate.createSchema(joi => ({
        id: joi.string().required(),
        path: joi.string(),
        url: joi.string()
    }))

    let input = {
        id: '1',
        path: 'asdf'
    }

    let output = validate.validate(input, schema, (err) => {
        console.log(err);

    })

    console.log(output);

})