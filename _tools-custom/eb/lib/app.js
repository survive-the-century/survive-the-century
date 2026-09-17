'use strict'

// Create app files (run-*.sh option 5). Builds the site with the app
// config, stages it into _site/app/www, and optionally builds native
// apps with Cordova. Unlike the interactive script, this does not launch
// emulators or open folders (both are unsuitable for a headless CLI).

const fs = require('node:fs')
const path = require('node:path')
const { run, jekyllBuild, ensureDir, remove } = require('./run')

// Which native platforms to build for.
const PLATFORMS = { a: ['android'], i: ['ios'], ai: ['android', 'ios'] }

async function app (opts) {
  const { config = '', mathjax = false, platform = 'none', release = false } = opts

  // Validate the platform up front so a typo (e.g. `--platform android`)
  // fails immediately rather than silently staging files and reporting
  // success. `none` (the default) legitimately means "stage only".
  if (platform !== 'none' && !PLATFORMS[platform]) {
    throw new Error(`Unknown --platform "${platform}". Use a, i, or ai (or omit to stage files only).`)
  }

  // Build the app HTML.
  const overlays = ['_configs/_config.app.yml']
  if (mathjax) overlays.push('_configs/_config.mathjax-enabled.yml')
  await jekyllBuild({ overlays, extraConfig: config })

  // Stage everything in _site into _site/app/www, excluding the app folder
  // itself. Done in Node so it works on all platforms without rsync (which
  // is not available by default on Windows).
  const siteDir = '_site'
  const wwwDir = path.join(siteDir, 'app', 'www')
  remove(wwwDir)
  ensureDir(wwwDir)
  for (const entry of fs.readdirSync(siteDir)) {
    if (entry === 'app') continue
    fs.cpSync(path.join(siteDir, entry), path.join(wwwDir, entry), { recursive: true })
  }
  console.log('\nApp-ready files staged in _site/app/www')

  // Stop here unless native builds were requested.
  if (platform === 'none') return
  const platforms = PLATFORMS[platform]

  if (platforms.includes('ios') && process.platform !== 'darwin') {
    console.warn('Skipping iOS build: only supported on macOS.')
  }

  // Build each requested platform with Cordova from the app directory.
  for (const target of platforms) {
    if (target === 'ios' && process.platform !== 'darwin') continue
    console.log(`\nBuilding ${target} app...`)
    await run('cordova', ['platform', 'rm', target], { cwd: '_site/app' }).catch(() => {})
    await run('cordova', ['platform', 'add', target], { cwd: '_site/app' })
    await run('cordova', ['prepare', target], { cwd: '_site/app' })
    const buildArgs = ['build', target]
    if (release) buildArgs.push('--release')
    await run('cordova', buildArgs, { cwd: '_site/app' })
  }
  console.log('\nApp build complete. See _site/app/platforms/ for output.')
}

module.exports = { app }
