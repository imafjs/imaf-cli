import { clearConsole, done, error, info, log, warn} from '../../src/lib/logger'

test('log', ()=>{
    log('test')
    info('info')
    done('done')
    error('err')
    warn('warn')
    clearConsole('clear')
})