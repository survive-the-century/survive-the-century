#!/usr/bin/env node
'use strict'

// `eb` — a small command-line front end for this EBTv1 project that mimics
// the EBTv2 `npm run eb -- ...` commands. Instead of the interactive
// run-linux.sh / run-mac.command / run-windows.bat menus, it runs the same
// underlying build commands directly, driven by flags. Run it from the
// project root, e.g. `npm run eb -- output -f print-pdf`.

const { parseArgs } = require('node:util')

const { pdf } = require('./lib/pdf')
const { web } = require('./lib/web')
const { epub } = require('./lib/epub')
const { app } = require('./lib/app')
const { word } = require('./lib/word')
const { images } = require('./lib/images')
const { reindex } = require('./lib/reindex')
const { setup } = require('./lib/setup')

const HELP = `
Electric Book CLI (EBTv1 wrapper)

Usage: npm run eb -- <command> [options]

Commands:
  output              Serve the book as a website (default format)
  output -f <format>  Build a specific format:
                        print-pdf   Print-ready PDF
                        screen-pdf  Screen PDF
                        web         Website (jekyll serve)
                        epub        EPUB
                        app         App files (optionally build with Cordova)
                        word        MS Word (.docx) files
  images              Convert source images to output formats
  reindex             Rebuild the search index (add --app for the app index)
  setup               Install/update Ruby gems and Node modules

Options:
  -f, --format <name>   Output format for the "output" command
  -b, --book <folder>   Book folder to process (default: book)
  -l, --language <code> Translation subdirectory (e.g. fr)
  -c, --config <files>  Extra Jekyll configs, comma-separated, no spaces
      --mathjax         Enable MathJax processing (pdf, epub, app)
      --baseurl <path>  Base URL for the website (web only)
      --from <format>   Source format for Word export (default: screen-pdf)
      --platform <a|i|ai>  Native app platform(s) to build (app only)
      --release         Build a release app (app only)
      --epubcheck <dir> Validate the epub with a local EpubCheck in <dir> (epub only)
      --skip-validation Skip epub validation, which otherwise runs by default (epub only)
  -h, --help            Show this help

Examples:
  npm run eb -- output
  npm run eb -- output -f print-pdf -b book
  npm run eb -- output -f epub -l fr --mathjax
  npm run eb -- output -f word --from web
  npm run eb -- images
  npm run eb -- reindex
`

async function main () {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      format: { type: 'string', short: 'f' },
      book: { type: 'string', short: 'b' },
      language: { type: 'string', short: 'l' },
      config: { type: 'string', short: 'c' },
      mathjax: { type: 'boolean' },
      baseurl: { type: 'string' },
      from: { type: 'string' },
      platform: { type: 'string' },
      release: { type: 'boolean' },
      epubcheck: { type: 'string' },
      'skip-validation': { type: 'boolean' },
      app: { type: 'boolean' },
      help: { type: 'boolean', short: 'h' }
    }
  })

  const command = positionals[0]

  if (values.help || !command) {
    console.log(HELP)
    return
  }

  // Common options passed through to every command.
  const opts = {
    book: values.book || 'book',
    language: values.language || '',
    config: values.config || '',
    mathjax: Boolean(values.mathjax),
    baseurl: values.baseurl || '',
    from: values.from || 'screen-pdf',
    platform: values.platform || 'none',
    release: Boolean(values.release),
    epubcheck: values.epubcheck || '',
    skipValidation: Boolean(values['skip-validation']),
    app: Boolean(values.app)
  }

  switch (command) {
    case 'output': {
      const format = values.format || 'web'
      switch (format) {
        case 'print-pdf':
        case 'screen-pdf':
          return pdf(format, opts)
        case 'web':
          return web(opts)
        case 'epub':
          return epub(opts)
        case 'app':
          return app(opts)
        case 'word':
          return word(opts)
        default:
          throw new Error(`Unknown format "${format}". Run \`npm run eb\` for help.`)
      }
    }
    case 'images':
      return images(opts)
    case 'reindex':
      return reindex(opts)
    case 'setup':
      return setup()
    default:
      throw new Error(`Unknown command "${command}". Run \`npm run eb\` for help.`)
  }
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`)
  process.exit(1)
})
