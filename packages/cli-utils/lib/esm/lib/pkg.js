import * as fs from 'fs';
import * as path from 'path';
import * as readPkg from 'read-pkg';
export function resolvePkg(context) {
    if (fs.existsSync(path.join(context, 'package.json'))) {
        return readPkg.sync({ cwd: context });
    }
    return {};
}
