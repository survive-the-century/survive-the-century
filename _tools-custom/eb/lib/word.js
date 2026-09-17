'use strict'

// Export to Word (run-*.sh option 6). Builds HTML from a chosen source
// format with the maths engine disabled (so Pandoc gets raw TeX), then
// converts each file listed in file-list from HTML to .docx.

const fs = require('node:fs')
const path = require('node:path')
const { run, jekyllBuild, textDir } = require('./run')

// Source formats the shell script offers to convert from.
const SOURCE_FORMATS = ['print-pdf', 'screen-pdf', 'web', 'epub']

async function word (opts) {
  const { book = 'book', language = '', config = '', from = 'screen-pdf' } = opts

  if (!SOURCE_FORMATS.includes(from)) {
    throw new Error(`Unknown --from format "${from}". Use one of: ${SOURCE_FORMATS.join(', ')}`)
  }

  // Build with the maths engine off; Pandoc cannot use SVG output anyway.
  await jekyllBuild({
    overlays: [`_configs/_config.${from}.yml`, '_configs/_config.math-disabled.yml'],
    extraConfig: config
  })

  const dir = textDir(book, language)
  const fileListPath = path.join(dir, 'file-list')

  // Read file-list, dropping blank lines (the script does the same with sed).
  const files = fs.readFileSync(fileListPath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  // Convert each HTML file to .docx (Pandoc appends .docx to the name).
  // The shell script's loop keeps going if an individual file fails (e.g.
  // file-list references a conditional page that wasn't built), so we do
  // the same and report any failures at the end rather than aborting.
  const failed = []
  for (const file of files) {
    try {
      await run(
        'pandoc',
        [file, '-f', 'html', '-t', 'docx', '-s', '-o', `${file}.docx`],
        { cwd: dir }
      )
    } catch {
      failed.push(file)
    }
  }

  // Fix the doubled extension: foo.html.docx -> foo.docx
  for (const file of files) {
    const source = path.join(dir, `${file}.docx`)
    const target = path.join(dir, file.replace(/\.html$/, '.docx'))
    if (fs.existsSync(source)) fs.renameSync(source, target)
  }

  console.log(`\nWord files created in ${dir}`)
  if (failed.length) {
    console.warn(`Skipped ${failed.length} file(s) not found or not converted:`)
    for (const file of failed) console.warn(`  - ${file}`)
  }
}

module.exports = { word }
