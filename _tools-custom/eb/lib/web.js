'use strict'

// Run the book as a local website (run-*.sh option 3). Jekyll serve
// blocks and owns the terminal until stopped with Ctrl+C, matching the
// behaviour of EBTv2's `npm run eb -- output`.

const { jekyllBuild } = require('./run')

function web (opts) {
  const { config = '', baseurl = '' } = opts
  return jekyllBuild({
    overlays: ['_configs/_config.web.yml'],
    extraConfig: config,
    serve: true,
    baseurl
  })
}

module.exports = { web }
