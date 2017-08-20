/**
 * Log info to console
 */
exports.log = (...args) => {
  if (process.env.NODE_ENV !== 'testing') {
    console.log(...args)
  }
}

/**
 * Log warn to console & exit process
 */
exports.fatal = (message, err) => {
  if (process.env.NODE_ENV === 'testing') throw err

  console.warn(message)
  process.env.NODE_ENV === 'development' && console.warn('\n', err)
  console.warn() // padding
  // process.exit(1)
}
