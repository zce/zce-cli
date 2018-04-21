/**
 * https://github.com/sindresorhus/hook-std/blob/master/index.js
 */

module.exports = type => {
  if (!['stdout', 'stderr'].includes(type)) {
    throw new Error('`type` must be \'stdout\' or \'stderr\'')
  }

  const stdio = process[type]
  const original = stdio.write

  const data = []

  stdio.write = (chunk, encoding) => {
    data.push(chunk.toString(encoding))
  }

  return () => {
    stdio.write = original
    return data.join('')
  }
}

module.exports.stdout = module.exports.bind(null, 'stdout')
module.exports.stderr = module.exports.bind(null, 'stderr')
