import * as path from "path";
import { resolvePkg } from "../../src/lib/pkg";

test('', ()=> console.log(resolvePkg(path.join(__dirname, '../../'))))