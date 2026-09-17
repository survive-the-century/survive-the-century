'use strict'

// Create app files (run-*.sh option 5). Builds the site with the app
// config, stages it into _site/app/www, and optionally builds native
// apps with Cordova. Unlike the interactive script, this does not launch
// emulators or open folders (both are unsuitable for a headless CLI).

const { run, jekyllBuild, ensureDir, remove } = require('./run')

// Which native platforms to build for.
const PLATFORMS = { a: ['android'], i: ['ios'], ai: ['android', 'ios'] }

async function app (opts) {
  const { config = '', mathjax = false, platform = 'none', release = false } = opts

  // Build the app HTML.
  const overlays = ['_configs/_config.app.yml']
  if (mathjax) overlays.push('_configs/_config.mathjax-enabled.yml')
  await jekyllBuild({ overlays, extraConfig: config })

  // Stage everything into _site/app/www, excluding the app folder itself.
  // rsync can exclude where cp cannot, matching the shell script.
  const wwwDir = '_site/app/www'
  remove(wwwDir)
  ensureDir(wwwDir)
  await run('rsync', ['-r', '_site/.', wwwDir, '--exclude=/app'])
  console.log('\nApp-ready files staged in _site/app/www')

  // Stop here unless native builds were requested.
  const platforms = PLATFORMS[platform]
  if (!platforms) return

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
