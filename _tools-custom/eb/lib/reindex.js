'use strict'

// Refresh the search index (run-*.sh option 8). Builds the site (web or
// app file list) and then regenerates the index from the built HTML.

const { run, jekyllBuild } = require('./run')

async function reindex (opts) {
  const { config = '', app = false } = opts
  const overlay = app ? '_configs/_config.app.yml' : '_configs/_config.web.yml'
  await jekyllBuild({ overlays: [overlay], extraConfig: config })
  await run('node', ['_site/assets/js/render-search-index.js'])
  console.log('\nSearch index refreshed.')
}

module.exports = { reindex }
