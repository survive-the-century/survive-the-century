'use strict'

// Print PDF (run-*.sh option 1) and screen PDF (option 2). Both branches
// are identical apart from the config overlay and the output filename
// suffix, so they share one implementation.

const path = require('node:path')
const { run, jekyllBuild, textDir, ensureDir } = require('./run')

async function pdf (format, opts) {
  const { book = 'book', language = '', config = '', mathjax = false } = opts

  // Build the HTML, enabling MathJax config only when requested.
  const overlays = [`_configs/_config.${format}.yml`]
  if (mathjax) overlays.push('_configs/_config.mathjax-enabled.yml')
  await jekyllBuild({ overlays, extraConfig: config })

  // Pre-process MathJax in the built HTML when needed.
  if (mathjax) {
    const gulpArgs = ['mathjax', '--book', book]
    if (language) gulpArgs.push('--language', language)
    await run('gulp', gulpArgs)
  }

  // Name matches the shell scripts: <book>[-<language>]-print|screen.pdf
  const suffix = format === 'print-pdf' ? 'print' : 'screen'
  const filename = language ? `${book}-${language}-${suffix}` : `${book}-${suffix}`

  // Prince runs from inside the book's text folder (so file-list paths
  // resolve) and writes the PDF to the project's _output folder.
  const outputDir = path.join(process.cwd(), '_output')
  ensureDir(outputDir)
  const outputPath = path.join(outputDir, `${filename}.pdf`)
  await run(
    'prince',
    ['-v', '-l', 'file-list', '-o', outputPath, '--javascript'],
    { cwd: textDir(book, language) }
  )
  console.log(`\nPDF created: _output/${filename}.pdf`)
}

module.exports = { pdf }
