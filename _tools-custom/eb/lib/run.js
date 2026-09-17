'use strict'

// Shared helpers for the `eb` CLI: process spawning, Jekyll builds,
// and a few filesystem conveniences used across the output commands.

const { spawn } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

// Spawn a command, streaming its stdio to the terminal, and resolve when
// it exits cleanly. We pass an args array (not a single string) so that
// arguments with spaces are handled safely and no shell interpolation
// happens on POSIX. On Windows we enable the shell so that .cmd/.bat
// shims (npm, gulp, bundle, cordova) resolve on the PATH.
function run (command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`\`${command}\` exited with code ${code}`))
      }
    })
  })
}

// Assemble the comma-separated Jekyll --config overlay (base config first,
// then the caller's overlays, then any extra user configs) and run a build
// or serve. This mirrors how every run-*.sh branch invokes Jekyll.
function jekyllBuild ({ overlays = [], extraConfig = '', serve = false, baseurl = '' }) {
  const configs = ['_config.yml', ...overlays]
  if (extraConfig) configs.push(extraConfig)
  const args = ['exec', 'jekyll', serve ? 'serve' : 'build', `--config=${configs.join(',')}`]
  if (baseurl) args.push(`--baseurl=/${baseurl}`)
  return run('bundle', args)
}

// Return the path to a book's built text folder in _site, accounting for
// an optional translation subdirectory.
function textDir (book, language) {
  return language
    ? path.join('_site', book, language, 'text')
    : path.join('_site', book, 'text')
}

// Ensure a directory exists (like `mkdir -p`).
function ensureDir (dir) {
  fs.mkdirSync(dir, { recursive: true })
}

// Remove a file or directory if it exists (like `rm -r` but never fails
// when the target is absent).
function remove (target) {
  fs.rmSync(target, { recursive: true, force: true })
}

// Copy the *contents* of a source directory into a destination directory,
// merging into it if it already exists (equivalent to `cp -a src/. dest/`).
function copyContents (src, dest) {
  ensureDir(dest)
  fs.cpSync(src, dest, { recursive: true })
}

// Copy a file or directory *into* a destination directory as a child
// (equivalent to `cp -a src dest/`). Like cp, when the destination already
// contains a directory of the same name, the source nests inside it.
function copyInto (src, destDir) {
  ensureDir(destDir)
  const base = path.basename(src)
  let target = path.join(destDir, base)
  if (
    fs.existsSync(target) &&
    fs.statSync(target).isDirectory() &&
    fs.statSync(src).isDirectory()
  ) {
    target = path.join(target, base)
  }
  fs.cpSync(src, target, { recursive: true })
}

module.exports = {
  run, jekyllBuild, textDir, ensureDir, remove, copyContents, copyInto
}
