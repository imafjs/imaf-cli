import { spinner } from "../../src";


test('spinner logWithSpinner', ()=> {
    spinner.logWithSpinner('aa', 'bb')
    spinner.pauseSpinner()
    spinner.resumeSpinner()
    spinner.failSpinner('err')
    spinner.stopSpinner(true)
})
// test('spinner stopSpinner', ()=> logWithSpinner('aa', 'bb'))