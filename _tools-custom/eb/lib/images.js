'use strict'

// Convert source images to output formats (run-*.sh option 7). This runs
// the project's default Gulp task, which optimises images in a book's
// _source folder and copies them into the per-format image folders.

const { run } = require('./run')

function images (opts) {
  const { book = 'book', language = '' } = opts
  // The shell script always passes both flags, with an empty language
  // string when not processing a translation.
  return run('gulp', ['--book', book, '--language', language])
}

module.exports = { images }
