import ora from 'ora'
import * as chalk from'chalk'

/**
 * 进度条
 */
const spinner = ora()
let lastMsg = null
let isPaused = false

export function logWithSpinner(symbol, msg) {
  if (!msg) {
    msg = symbol
    symbol = chalk.green('✔')
  }
  if (lastMsg) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text
    })
  }
  spinner.text = ' ' + msg
  lastMsg = {
    symbol: symbol + ' ',
    text: msg
  }
  spinner.start()
}

export function stopSpinner(persist) {
  if (!spinner.isSpinning) {
    return
  }

  if (lastMsg && persist !== false) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text
    })
  } else {
    spinner.stop()
  }
  lastMsg = null
}

export function pauseSpinner() {
  if (spinner.isSpinning) {
    spinner.stop()
    isPaused = true
  }
}

export function resumeSpinner() {
  if (isPaused) {
    spinner.start()
    isPaused = false
  }
}

export function failSpinner(text) {
  spinner.fail(text)
}

