
export const exportProcess = !process.env.MAF_CLI_TEST

/**
 * exit 进程退出
 */
export function exit(code) {
  if (exportProcess) {
    process.exit(code)
  } else if (code > 0) {
    throw new Error(`Process exited with code ${code}`)
  }
}
