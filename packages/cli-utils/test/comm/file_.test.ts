import * as path from "path"
import { file_ } from "../../src"

test('file_ test', () => {

    console.log(path.normalize(__dirname + '../../'))
    console.log(__dirname)

    console.log(file_.hasFile(path.join(__dirname, '../../'), 'package.json'))
})