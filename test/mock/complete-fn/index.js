module.exports = {
  complete: context => {
    console.log('  To get started:')
    console.log()
    context.inPlace || console.log(`    $ cd ${require('path').relative(process.cwd(), context.dest)}`)
    console.log('    $ npm install')
    console.log('    $ npm run dev')
    console.log()
    console.log('  Good luck~')
  }
}
