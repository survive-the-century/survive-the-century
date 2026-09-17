'use strict'

// Install or update dependencies (run-*.sh option 9). Mirrors EBTv2's
// `npm run setup`: update and install Ruby gems, then install Node modules.

const { run } = require('./run')

async function setup () {
  await run('bundle', ['update'])
  await run('bundle', ['install'])
  await run('npm', ['install'])
  console.log('\nDependencies installed.')
}

module.exports = { setup }
