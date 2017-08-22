const chalk = require('chalk')
const minimatch = require('minimatch')
const Metalsmith = require('metalsmith')
const util = require('./util')
const logger = require('./logger')
const template = require('./template')

/**
 * Filter by template filters
 */
const filter = filters => {
  return (files, metalsmith, next) => {
    if (!filters) return next()

    const metadata = metalsmith.metadata()

    const filenames = Object.keys(files)

    Object.keys(filters)
      .filter(glob => !filters[glob](metadata))
      .forEach(glob => {
        const match = minimatch.filter(glob, { dot: true, matchBase: true })
        filenames.forEach(file => match(file) && delete files[file])
      })

    next()
  }
}

const rename = () => {
  return (files, metalsmith, next) => {
    const metadata = metalsmith.metadata()
    const filenames = Object.keys(files)
    filenames.forEach(original => {
      const current = template.render(original, metadata)
      if (current === original) return
      files[current] = files[original]
      delete files[original]
    })
    next()
  }
}

/**
 * Template render
 */
const render = helpers => {
  helpers && template.registerHelper(helpers)

  return (files, metalsmith, next) => {
    const metadata = metalsmith.metadata()
    for (const item in files) {
      let contents = files[item].contents.toString()
      contents = template.render(contents, metadata)
      files[item].contents = Buffer.from(contents)
    }
    next()
  }
}

/**
 * Generate from template
 * @param  {String}   src     Template path
 * @param  {String}   dest    Destination path
 * @param  {Object}   data    User answers
 * @param  {Object}   options Template options
 * @return {Promise}          Generate promise
 */
module.exports = (src, dest, data, options) => new Promise((resolve, reject) => {
  const { source, metadata, filters, helpers, plugin } = options || {}

  const metalsmith = Metalsmith(src)
  metalsmith.metadata(Object.assign({}, metadata, data))

  typeof plugin === 'function' && metalsmith.use(plugin)

  metalsmith
    .use(filter(filters))
    .use(rename())
    .use(render(helpers))
    .source(source || 'template')
    .destination(dest)
    .clean(false)
    .build((err, files) => {
      if (err) return reject(err)
      logger.log(`\n🎉  "${data.name}" generated into ${chalk.yellow(util.tildify(dest))}`)
      resolve(files)
    })
})
