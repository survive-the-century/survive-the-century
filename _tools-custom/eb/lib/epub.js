'use strict'

// Create an epub (run-*.sh option 4). This is the most involved output:
// it builds the HTML, assembles the epub file tree under _site/epub,
// converts HTML to XHTML with Gulp, stages an uncompressed copy in
// _output, then zips it into a .epub. The copy logic below mirrors the
// shell script branch step for step, including its translation handling.

const fs = require('node:fs')
const path = require('node:path')
const { run, jekyllBuild, ensureDir, remove, copyContents, copyInto } = require('./run')

// True if the path exists (file or directory).
function exists (p) {
  return fs.existsSync(p)
}

// True if the path is an existing directory.
function isDir (p) {
  return fs.existsSync(p) && fs.statSync(p).isDirectory()
}

// Count matching font files to decide whether the epub bundles fonts.
function hasFonts (dir) {
  if (!isDir(dir)) return false
  return fs.readdirSync(dir).some((name) => /\.(ttf|otf|woff2?)$/i.test(name))
}

// Copy only the files named in a book's file-list into the epub text folder.
function copyListedFiles (fromTextDir, toTextDir) {
  const list = fs.readFileSync(path.join(fromTextDir, 'file-list'), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  ensureDir(toTextDir)
  for (const file of list) {
    fs.copyFileSync(path.join(fromTextDir, file), path.join(toTextDir, file))
  }
}

async function epub (opts) {
  const { book = 'book', language = '', config = '', mathjax = false, epubcheck = '', skipValidation = false } = opts

  const root = process.cwd()
  const site = path.join(root, '_site')
  const stage = path.join(site, 'epub') // where the epub tree is assembled
  const epubName = language ? `${book}-${language}` : book

  // 1. Build the HTML.
  const overlays = ['_configs/_config.epub.yml']
  if (mathjax) overlays.push('_configs/_config.mathjax-enabled.yml')
  await jekyllBuild({ overlays, extraConfig: config })

  // 2. Decide which optional assets to include.
  const includeFonts = hasFonts(path.join(root, '_epub', 'fonts'))
  const includeScripts = exists(path.join(site, 'assets', 'js', 'bundle.js'))

  // 3. Copy source files into the epub staging tree.
  console.log('Copying files to epub folder...')
  if (!language) {
    copyListedFiles(path.join(site, book, 'text'), path.join(stage, 'text'))
    if (isDir(path.join(site, book, 'images', 'epub'))) {
      copyContents(path.join(site, book, 'images', 'epub'), path.join(stage, 'images', 'epub'))
    }
    if (isDir(path.join(site, 'items', 'images', 'epub'))) {
      copyContents(path.join(site, 'items', 'images', 'epub'), path.join(stage, 'items', 'images', 'epub'))
    }
    if (isDir(path.join(site, book, 'styles'))) {
      copyContents(path.join(site, book, 'styles'), path.join(stage, 'styles'))
    }
    if (exists(path.join(site, book, 'package.opf'))) {
      fs.copyFileSync(path.join(site, book, 'package.opf'), path.join(stage, 'package.opf'))
    }
    if (exists(path.join(site, book, 'toc.ncx'))) {
      fs.copyFileSync(path.join(site, book, 'toc.ncx'), path.join(stage, 'toc.ncx'))
    }
  } else {
    // Translation: text
    copyListedFiles(
      path.join(site, book, language, 'text'),
      path.join(stage, language, 'text')
    )
    // Images: prefer the translation's, fall back to the parent's.
    if (isDir(path.join(site, book, language, 'images'))) {
      copyContents(
        path.join(site, book, language, 'images', 'epub'),
        path.join(stage, language, 'images', 'epub')
      )
    } else {
      copyContents(path.join(site, book, 'images', 'epub'), path.join(stage, 'images', 'epub'))
    }
    // Items images: translated set if present, else the shared set.
    if (isDir(path.join(site, 'items', language, 'images', 'epub'))) {
      copyContents(
        path.join(site, 'items', language, 'images', 'epub'),
        path.join(stage, 'items', language, 'images', 'epub')
      )
    } else if (isDir(path.join(site, 'items', 'images', 'epub'))) {
      copyContents(path.join(site, 'items', 'images', 'epub'), path.join(stage, 'items', 'images', 'epub'))
    }
    // Styles: always include the parent's; add the translation's if present.
    if (isDir(path.join(site, book, language, 'styles'))) {
      copyContents(path.join(site, book, language, 'styles'), path.join(stage, language, 'styles'))
    }
    copyContents(path.join(site, book, 'styles'), path.join(stage, 'styles'))
    // Fonts: translation's if present, else the parent's.
    if (includeFonts) {
      if (isDir(path.join(site, book, language, 'fonts'))) {
        copyContents(path.join(site, book, language, 'fonts'), path.join(stage, language, 'fonts'))
      } else {
        copyContents(path.join(site, book, 'fonts'), path.join(stage, 'fonts'))
      }
    }
    if (exists(path.join(site, book, language, 'package.opf'))) {
      fs.copyFileSync(path.join(site, book, language, 'package.opf'), path.join(stage, 'package.opf'))
    }
    if (exists(path.join(site, book, language, 'toc.ncx'))) {
      fs.copyFileSync(path.join(site, book, language, 'toc.ncx'), path.join(stage, 'toc.ncx'))
    }
  }

  // 4. Copy MathJax and the JS bundle into the staging tree if needed.
  if (mathjax) {
    copyContents(path.join(site, 'assets', 'js', 'mathjax'), path.join(stage, 'mathjax'))
  }
  if (includeScripts) {
    ensureDir(path.join(stage, 'js'))
    fs.copyFileSync(path.join(site, 'assets', 'js', 'bundle.js'), path.join(stage, 'js', 'bundle.js'))
  }

  // 5. Convert .html files and internal links to .xhtml with Gulp.
  console.log('Renaming .html to .xhtml...')
  for (const task of ['epub:xhtmlLinks', 'epub:xhtmlFiles', 'epub:cleanHtmlFiles']) {
    const args = [task]
    if (language) args.push('--language', language)
    await run('gulp', args)
  }

  // 6. Remove any previous output for this epub.
  const outputDir = path.join(root, '_output')
  ensureDir(outputDir)
  remove(path.join(outputDir, epubName))
  remove(path.join(outputDir, `${epubName}.zip`))
  remove(path.join(outputDir, `${epubName}.epub`))

  // 7. Prepare the output folder for the uncompressed epub.
  const outEpub = path.join(outputDir, epubName)
  ensureDir(outEpub)
  if (language) ensureDir(path.join(outEpub, language))

  // 8. Drop staged assets we decided not to include.
  if (!includeFonts) remove(path.join(stage, 'fonts'))
  if (!mathjax) remove(path.join(stage, 'mathjax'))

  // 9. Assemble the uncompressed epub from the staging tree.
  console.log('Assembling epub...')
  if (!language) {
    if (isDir(path.join(stage, 'text'))) copyInto(path.join(stage, 'text'), outEpub)
    if (isDir(path.join(stage, 'images'))) copyInto(path.join(stage, 'images'), outEpub)
    if (exists(path.join(site, 'items', 'images', 'epub')) && isDir(path.join(stage, 'items', 'images'))) {
      copyInto(path.join(stage, 'items', 'images'), outEpub)
    }
  } else {
    if (isDir(path.join(stage, language, 'text'))) {
      copyInto(path.join(stage, language, 'text'), path.join(outEpub, language))
    }
    if (isDir(path.join(stage, language, 'images'))) {
      copyInto(path.join(stage, language, 'images'), path.join(outEpub, language))
    } else if (isDir(path.join(stage, 'images'))) {
      copyInto(path.join(stage, 'images'), outEpub)
    }
    if (isDir(path.join(stage, 'items', language, 'images'))) {
      copyInto(path.join(stage, 'items', language, 'images'), path.join(outEpub, language))
    } else if (isDir(path.join(stage, 'items', 'images'))) {
      copyInto(path.join(stage, 'items', 'images'), outEpub)
    }
  }
  // Fonts.
  if (isDir(path.join(stage, 'fonts'))) copyInto(path.join(stage, 'fonts'), outEpub)
  // Styles (parent always; translation's alongside).
  if (isDir(path.join(stage, 'styles'))) copyInto(path.join(stage, 'styles'), outEpub)
  if (language && isDir(path.join(stage, language, 'styles'))) {
    copyInto(path.join(stage, language, 'styles'), path.join(outEpub, language))
  }
  // MathJax.
  if (mathjax && isDir(path.join(stage, 'mathjax'))) copyInto(path.join(stage, 'mathjax'), outEpub)
  // JS bundle.
  if (isDir(path.join(stage, 'js'))) {
    ensureDir(path.join(outEpub, 'js'))
    fs.copyFileSync(path.join(stage, 'js', 'bundle.js'), path.join(outEpub, 'js', 'bundle.js'))
  }
  // Package metadata. The mimetype must come first for a valid epub.
  if (exists(path.join(stage, 'mimetype'))) {
    fs.copyFileSync(path.join(stage, 'mimetype'), path.join(outEpub, 'mimetype'))
  } else {
    console.warn('No mimetype file found. Your epub will not be valid.')
  }
  if (isDir(path.join(stage, 'META-INF'))) copyInto(path.join(stage, 'META-INF'), outEpub)
  if (exists(path.join(stage, 'package.opf'))) {
    fs.copyFileSync(path.join(stage, 'package.opf'), path.join(outEpub, 'package.opf'))
  }
  if (exists(path.join(stage, 'toc.ncx'))) {
    fs.copyFileSync(path.join(stage, 'toc.ncx'), path.join(outEpub, 'toc.ncx'))
  }

  // 10. Compress with the project's Node zip tool (run from _output).
  console.log('Compressing epub...')
  await run('node', [path.join(root, '_tools', 'zip', 'zip.js'), epubName], { cwd: outputDir })

  // 11. Rename .zip to .epub.
  const zipPath = path.join(outputDir, `${epubName}.zip`)
  const epubPath = path.join(outputDir, `${epubName}.epub`)
  if (exists(zipPath)) fs.renameSync(zipPath, epubPath)

  if (exists(epubPath)) {
    console.log(`\nEpub created: _output/${epubName}.epub`)
  } else {
    console.warn('\nSorry, there was a problem and the epub was not created.')
    return
  }

  // 12. Validate the epub. Like EBTv2, validation runs by default. Use a
  // local EpubCheck folder with --epubcheck, or skip entirely with
  // --skip-validation. epubchecker (run via npx, so no project dependency
  // is added) exits non-zero when it finds problems, so we surface the
  // report without treating it as a fatal CLI error.
  if (skipValidation) return
  console.log('\nValidating epub...')
  try {
    if (epubcheck) {
      await run('java', ['-jar', path.join(epubcheck, 'epubcheck.jar'), epubPath])
    } else {
      await run('npx', ['--yes', 'epubchecker', epubPath])
    }
    console.log('Epub validation passed.')
  } catch {
    console.warn('Epub validation reported problems (see output above).')
  }
}

module.exports = { epub }
