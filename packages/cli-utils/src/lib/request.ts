import fetch from 'node-fetch'

/**
 * 代理请求
 */

export function getJSON(url, opts) {
  const reqOpts = {
    method: 'GET',
    timeout: 30000,
    ...opts
  }

  return fetch(url, reqOpts).then(result => result.json())
}
export function postJSON(url, opts) {
  const reqOpts = {
    method: 'POST',
    timeout: 30000,
    ...opts
  }

  return fetch(url, reqOpts).then(result => result.json())
}